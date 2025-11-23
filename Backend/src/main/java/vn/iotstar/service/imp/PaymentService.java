package vn.iotstar.service.imp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import vn.iotstar.dto.*;
import vn.iotstar.entity.*;
import vn.iotstar.repository.*;
import vn.iotstar.service.IPaymentService;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.ssl.NoopHostnameVerifier;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory;
import org.apache.hc.client5.http.ssl.TrustAllStrategy;
import org.apache.hc.core5.ssl.SSLContexts;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService implements IPaymentService {

    private final IEmployerRepository employerRepo;
    private final IPostPackageRepository packageRepo;
    private final ITransactionRepository transactionRepo;
    private final ITransactionDetailRepository transactionDetailRepo;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final EmailService emailService; 
    private final IEmployerPackageLimitRepository employerLimitRepo;
  
    @Value("${vietqr.client-id}")
    private String vietqrClientId;

    @Value("${vietqr.api-key}")
    private String vietqrApiKey;

    @Value("${vietqr.lookup-url}")
    private String vietqrLookupUrl;

  
    @Value("${payment.receiver.account:0392363245}")
    private String RECEIVER_BANK_ACCOUNT;

    @Value("${payment.receiver.bank:MB}")
    private String RECEIVER_BANK_CODE;

    @Value("${payment.receiver.name:NGUYEN VAN TRONG}")
    private String RECEIVER_ACCOUNT_NAME;

    @Value("${payment.vietqr.template:compact}")
    private String VIETQR_TEMPLATE;

    private static final String VIETQR_STATIC_URL = "https://img.vietqr.io/image/{bankId}-{accountNo}-{template}.png?amount={amount}&addInfo={description}&accountName={accountName}";
    private static final String BIN_API = "https://lookup.binlist.net";

  
    @Override
    public BankCardResponseDTO getCardHolderInfo(BankCardDTO request) {
        try {
            String cardNumber = request.getCardNumber().replaceAll("\\s+", "");
            if (cardNumber.length() < 13 || cardNumber.length() > 19) {
                return new BankCardResponseDTO(false, null, null, "Số thẻ không hợp lệ");
            }
            if (!isValidCardNumber(cardNumber)) {
                return new BankCardResponseDTO(false, null, null, "Số thẻ không đúng định dạng");
            }
            String bankName = getBankFromBINLookup(cardNumber);
            return new BankCardResponseDTO(false, null, bankName, "Không thể xác thực thông tin thẻ tự động. Vui lòng nhập tên chủ thẻ thủ công.");
        } catch (Exception e) {
            return new BankCardResponseDTO(false, null, null, "Lỗi hệ thống: " + e.getMessage());
        }
    }

  
    @Override
    public QRCodeResponseDTO generateQRCode(QRCodeRequestDTO request) {
        try {
            if (request.getPackageID() == null || request.getEmployerID() == null) {
                return new QRCodeResponseDTO(false, null, null, null, null, null, null, "Thiếu thông tin packageID hoặc employerID");
            }

            PostPackage postPackage = packageRepo.findById(request.getPackageID())
                    .orElseThrow(() -> new RuntimeException("Gói dịch vụ không tồn tại"));

            Employer employer = employerRepo.findById(request.getEmployerID())
                    .orElseThrow(() -> new RuntimeException("Nhà tuyển dụng không tồn tại"));

        
            BigDecimal taxRate = postPackage.getTaxRate() != null 
                ? postPackage.getTaxRate().divide(BigDecimal.valueOf(100)) 
                : BigDecimal.ZERO;
            
            BigDecimal taxAmount = postPackage.getPrice().multiply(taxRate);
            BigDecimal totalAmount = postPackage.getPrice().add(taxAmount);

            String transferContent = generateTransferContent(employer.getEmployerID(), postPackage.getPackageID());
            String qrUrl = generateStaticVietQR(RECEIVER_BANK_CODE, RECEIVER_BANK_ACCOUNT, totalAmount, transferContent, RECEIVER_ACCOUNT_NAME);

            return new QRCodeResponseDTO(
                    true,
                    qrUrl,
                    RECEIVER_BANK_ACCOUNT,
                    getBankFullName(RECEIVER_BANK_CODE),
                    RECEIVER_ACCOUNT_NAME,
                    totalAmount,
                    transferContent,
                    "Tạo mã QR thành công"
            );

        } catch (Exception e) {
            return new QRCodeResponseDTO(false, null, null, null, null, null, null, "Lỗi: " + e.getMessage());
        }
    }

    
    @Override
    @Transactional
    public PaymentResponseDTO verifyQRPayment(String transactionRef, Integer employerID) {
        try {
            String[] parts = transactionRef.split(" ");
            if (parts.length < 3) {
                return new PaymentResponseDTO(false, "Mã giao dịch không hợp lệ", null, null);
            }

            Integer empID = Integer.parseInt(parts[1]);
            Integer pkgID = Integer.parseInt(parts[2]);

            if (!empID.equals(employerID)) {
                return new PaymentResponseDTO(false, "Mã giao dịch không khớp với tài khoản", null, null);
            }

            PostPackage postPackage = packageRepo.findById(pkgID)
                    .orElseThrow(() -> new RuntimeException("Gói dịch vụ không tồn tại"));

            Employer employer = employerRepo.findById(employerID)
                    .orElseThrow(() -> new RuntimeException("Nhà tuyển dụng không tồn tại"));

            BigDecimal taxRate = postPackage.getTaxRate() != null 
                    ? postPackage.getTaxRate().divide(BigDecimal.valueOf(100)) 
                    : BigDecimal.ZERO;
                
            BigDecimal taxAmount = postPackage.getPrice().multiply(taxRate);
            BigDecimal totalAmount = postPackage.getPrice().add(taxAmount);

            // KIỂM TRA THANH TOÁN THẬT
            boolean paid = isActuallyPaid(transactionRef, totalAmount);
            if (!paid) {
                return new PaymentResponseDTO(false, "Giao dịch chưa được thanh toán. Vui lòng thực hiện chuyển khoản trước khi xác nhận.", null, null);
            }

          
            List<Transaction> existingTrans = transactionRepo
                    .findByEmployer_EmployerIDAndPaymentMethod(employerID, "QR_CODE");
//
//            for (Transaction trans : existingTrans) {
//                if (trans.getCreateDate().equals(LocalDate.now())) {
//                    return new PaymentResponseDTO(false,
//                            "Bạn đã có giao dịch thanh toán hôm nay. Vui lòng kiểm tra lại.",
//                            trans.getTransactionID(), null);
//                }
//            }

           
            Transaction transaction = new Transaction();
            transaction.setEmployer(employer);
            transaction.setPaymentMethod("QR_CODE");
            transaction.setCreateDate(LocalDate.now());
            transaction.setTotal(totalAmount);
            transaction.setPostPackage(postPackage);
            transaction = transactionRepo.save(transaction);

            TransactionDetail transactionDetail = new TransactionDetail();
            transactionDetail.setTransaction(transaction);
            transactionDetail.setExpiryDate(calculateExpiryDate(postPackage.getDuration()));
            transactionDetailRepo.save(transactionDetail);
            
            String email = employer.getAccount().getEmail();
            if (email != null && !email.isEmpty()) {
                String subject = "Hóa đơn thanh toán gói " + postPackage.getPackageName();
                String content = String.format(
                    "Cảm ơn bạn đã thanh toán gói %s.\nTổng tiền: %s VNĐ.\nGói sẽ có hiệu lực từ hôm nay.\n\nNếu cần hỗ trợ, vui lòng liên hệ: gzconnect.team@gmail.com",
                    postPackage.getPackageName(), formatCurrency(totalAmount)
                );
                emailService.sendSimpleEmail(email, subject, content);
            }
            
            EmployerPackageLimit limit = employerLimitRepo
                    .findByEmployer_EmployerID(employer.getEmployerID())
                    .orElse(new EmployerPackageLimit());

            limit.setEmployer(employer);
            limit.setMaxPosts(postPackage.getMaxPosts());
            limit.setPostsLeft(postPackage.getMaxPosts());
            limit.setMaxCvViews(postPackage.getMaxCvViews());
            limit.setCvViewsLeft(postPackage.getMaxCvViews());
            limit.setSupportPriorityDays(postPackage.getSupportPriorityDays());
            limit.setHas1on1Consult(postPackage.getHas1on1Consult());
            limit.setHasEmailSupport(postPackage.getHasEmailSupport());
            limit.setExpiryDate(transactionDetail.getExpiryDate());

            employerLimitRepo.save(limit);	
            return new PaymentResponseDTO(
                    true,
                    "Thanh toán QR Code thành công! Gói dịch vụ đã được kích hoạt.",
                    transaction.getTransactionID(),
                    totalAmount
            );

        } catch (Exception e) {
            return new PaymentResponseDTO(false, "Lỗi xác minh: " + e.getMessage(), null, null);
        }
    }
    
    private String formatCurrency(BigDecimal amount) {
        return String.format("%,.0f", amount);
    }
    
   
    @Override
    @Transactional
    public PaymentResponseDTO processBankTransfer(PaymentRequestDTO request) {
        try {
            if (request.getPackageID() == null || request.getEmployerID() == null) {
                return new PaymentResponseDTO(false, "Thiếu thông tin packageID hoặc employerID", null, null);
            }

            PostPackage postPackage = packageRepo.findById(request.getPackageID())
                    .orElseThrow(() -> new RuntimeException("Gói dịch vụ không tồn tại"));

            Employer employer = employerRepo.findById(request.getEmployerID())
                    .orElseThrow(() -> new RuntimeException("Nhà tuyển dụng không tồn tại"));

            BigDecimal taxRate = postPackage.getTaxRate() != null 
                    ? postPackage.getTaxRate().divide(BigDecimal.valueOf(100)) 
                    : BigDecimal.ZERO;
                
            BigDecimal taxAmount = postPackage.getPrice().multiply(taxRate);
            BigDecimal totalAmount = postPackage.getPrice().add(taxAmount);

            Transaction transaction = new Transaction();
            transaction.setEmployer(employer);
            transaction.setPaymentMethod("BANK_TRANSFER");
            transaction.setCreateDate(LocalDate.now());
            transaction.setTotal(totalAmount);
            transaction.setPostPackage(postPackage);
            transaction = transactionRepo.save(transaction);

            TransactionDetail transactionDetail = new TransactionDetail();
            transactionDetail.setTransaction(transaction);
            transactionDetail.setExpiryDate(calculateExpiryDate(postPackage.getDuration()));
            transactionDetailRepo.save(transactionDetail);
            
     
            String email = employer.getAccount().getEmail();
            if (email != null && !email.isEmpty()) {
                String subject = "Xác nhận thanh toán chuyển khoản – Gói " + postPackage.getPackageName();
                String content = String.format(
                    "Cảm ơn bạn đã thực hiện chuyển khoản cho gói %s.\nTổng tiền: %s VNĐ.\nGiao dịch sẽ được xác minh trong vòng 24h.\n\nNếu cần hỗ trợ, vui lòng liên hệ: gzconnect.team@gmail.com",
                    postPackage.getPackageName(), formatCurrency(totalAmount)
                );
                emailService.sendSimpleEmail(email, subject, content);
            }
            
            return new PaymentResponseDTO(
                    true,
                    "Đã ghi nhận thông tin chuyển khoản. Giao dịch sẽ được xác minh trong vòng 24h.",
                    transaction.getTransactionID(),
                    totalAmount
            );

        } catch (Exception e) {
            return new PaymentResponseDTO(false, "Lỗi: " + e.getMessage(), null, null);
        }
    }

  

    @Value("${casso.api-key}")
    private String cassoApiKey;

    @Value("${casso.api-url}")
    private String cassoApiUrl;

    private boolean isActuallyPaid(String transactionRef, BigDecimal amount) {
        try {
            RestTemplate rest = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Apikey " + cassoApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            String today = LocalDate.now().toString();
            String url = String.format(
                "%s/transactions?fromDate=%s&toDate=%s&pageSize=100",
                cassoApiUrl, today, today
            );
            
            log.info("【Casso】Checking payment - URL: {}", url);
            log.info("【Casso】Transaction ref: {}", transactionRef);
            log.info("【Casso】Expected amount: {}", amount);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<CassoResponseDTO> res = rest.exchange(
                url, HttpMethod.GET, entity, CassoResponseDTO.class
            );
            
            if (res.getStatusCode() != HttpStatus.OK || res.getBody() == null) {
                log.error("【Casso】API call failed - Status: {}", res.getStatusCode());
                return false;
            }
            
            CassoResponseDTO response = res.getBody();
            
            if (response.getError() != 0) {
                log.error("【Casso】API Error {} - {}", response.getError(), response.getMessage());
                return false;
            }
            
            if (response.getData() == null || response.getData().getRecords() == null) {
                log.warn("【Casso】No transaction data returned");
                return false;
            }
            
            List<CassoResponseDTO.CassoTransaction> transactions = response.getData().getRecords();
            log.info("【Casso】Found {} transactions today", transactions.size());
            
   
            String normalizedRef = normalizeText(transactionRef);
            log.info("【Casso】Normalized ref: '{}'", normalizedRef);
            
            for (CassoResponseDTO.CassoTransaction tx : transactions) {
                String description = tx.getDescription();
                String normalizedDesc = normalizeText(description);
                int txAmount = tx.getAmount();
                
                log.info("【Casso】Comparing - Desc: '{}' → Normalized: '{}' | Amount: {} vs {}", 
                    description, normalizedDesc, txAmount, amount.intValue());
                
             
                if (normalizedDesc.contains(normalizedRef) && txAmount == amount.intValue()) {
                    log.info("【Casso】✅ Payment VERIFIED! Transaction ID: {}", tx.getId());
                    return true;
                }
            }
            
            log.warn("【Casso】❌ No matching transaction found for ref: {}", transactionRef);
            return false;
            
        } catch (Exception e) {
            log.error("【Casso】Lookup error: ", e);
            return false;
        }
    }
    
    private String generateStaticVietQR(String bankId, String accountNo,
                                        BigDecimal amount, String description,
                                        String accountName) {
        try {
            String encodedDescription = URLEncoder.encode(description, StandardCharsets.UTF_8.toString());
            String encodedAccountName = URLEncoder.encode(accountName, StandardCharsets.UTF_8.toString());

            return VIETQR_STATIC_URL
                    .replace("{bankId}", bankId)
                    .replace("{accountNo}", accountNo)
                    .replace("{template}", VIETQR_TEMPLATE)
                    .replace("{amount}", String.valueOf(amount.intValue()))
                    .replace("{description}", encodedDescription)
                    .replace("{accountName}", encodedAccountName);

        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Lỗi encoding URL: " + e.getMessage());
        }
    }

    private boolean isValidCardNumber(String cardNumber) {
        int sum = 0;
        boolean alternate = false;
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(cardNumber.charAt(i));
            if (alternate) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            alternate = !alternate;
        }
        return (sum % 10 == 0);
    }

    private String getBankFromBINLookup(String cardNumber) {
        try {
            String bin = cardNumber.substring(0, 6);
            String url = BIN_API + "/" + bin;
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept-Version", "3");
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode bankNode = root.path("bank");
                if (!bankNode.isMissingNode()) {
                    String bankName = bankNode.path("name").asText();
                    return bankName != null && !bankName.isEmpty() ? bankName : "Ngân hàng không xác định";
                }
            }
        } catch (Exception e) {
            log.warn("BIN lookup failed: {}", e.getMessage());
        }
        return "Ngân hàng không xác định";
    }

    private String getBankFullName(String bankCode) {
        Map<String, String> bankNames = Map.ofEntries(
            Map.entry("VCB", "Vietcombank"),
            Map.entry("VTB", "VietinBank"),
            Map.entry("BIDV", "BIDV"),
            Map.entry("AGR", "Agribank"),
            Map.entry("STB", "Sacombank"),
            Map.entry("TCB", "Techcombank"),
            Map.entry("ACB", "ACB"),
            Map.entry("VPB", "VPBank"),
            Map.entry("VIB", "VIB"),
            Map.entry("TPB", "TPBank"),
            Map.entry("MB", "MBBank")
        );
        return bankNames.getOrDefault(bankCode, "Ngân hàng");
    }
    
    
    private String normalizeText(String text) {
        if (text == null) return "";
        return text
            .toUpperCase()                          // Viết hoa
            .replaceAll("[^A-Z0-9]", "")           // Chỉ giữ chữ + số
            .trim();
    }
    
    private String generateTransferContent(Integer employerID, Integer packageID) {
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return String.format("EMPLOYERPACKAGE %d %d %s", employerID, packageID, uuid);
    }

    private LocalDate calculateExpiryDate(String duration) {
        try {
            int days = Integer.parseInt(duration.replaceAll("\\D+", ""));
            return LocalDate.now().plusDays(days);
        } catch (Exception e) {
            return LocalDate.now().plusDays(30);
        }
    }
    
    private RestTemplate restTemplateNoSSL() throws Exception {
        var sslContext = SSLContexts.custom()
                .loadTrustMaterial(TrustAllStrategy.INSTANCE)
                .build();

        var socketFactory = new SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE);

        var cm = PoolingHttpClientConnectionManagerBuilder.create()
                .setSSLSocketFactory(socketFactory)
                .build();

        CloseableHttpClient httpClient = HttpClients.custom()
                .setConnectionManager(cm)
                .build();

        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);
        return new RestTemplate(factory);
    }
}