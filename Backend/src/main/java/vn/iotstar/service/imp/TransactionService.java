package vn.iotstar.service.imp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.iotstar.dto.*;
import vn.iotstar.entity.*;
import vn.iotstar.repository.*;
import vn.iotstar.service.ITransactionService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {

    private final ITransactionRepository transactionRepo;
    private final ITransactionDetailRepository transactionDetailRepo;
    private final IPostPackageRepository packageRepo;
    private final IEmployerRepository employerRepo;

    private LocalDate calculateExpiryDate(String duration) {
        try {
            int days = Integer.parseInt(duration.replaceAll("\\D+", ""));
            return LocalDate.now().plusDays(days);
        } catch (Exception e) {
            return LocalDate.now().plusDays(30);
        }
    }

    @Override
    @Transactional
    public PaymentResponseDTO processPayment(PaymentRequestDTO request) {
        if (request.getPackageID() == null || request.getEmployerID() == null) {
            return new PaymentResponseDTO(false, "Thiếu thông tin packageID hoặc employerID", null, null);
        }

        if (request.getPaymentMethod() == null || request.getPaymentMethod().trim().isEmpty()) {
            return new PaymentResponseDTO(false, "Vui lòng chọn phương thức thanh toán", null, null);
        }

        PostPackage postPackage = packageRepo.findById(request.getPackageID())
                .orElseThrow(() -> new RuntimeException("Gói dịch vụ không tồn tại"));

        Employer employer = employerRepo.findById(request.getEmployerID())
                .orElseThrow(() -> new RuntimeException("Nhà tuyển dụng không tồn tại"));

        if (postPackage.getPrice().compareTo(BigDecimal.ZERO) == 0) {
            return new PaymentResponseDTO(
                    false,
                    "Gói miễn phí không cần thanh toán. Vui lòng sử dụng API kích hoạt gói miễn phí.",
                    null, null);
        }

        BigDecimal taxAmount = postPackage.getPrice()
                .multiply(postPackage.getTaxRate() != null ? postPackage.getTaxRate() : BigDecimal.ZERO);
        BigDecimal totalAmount = postPackage.getPrice().add(taxAmount);

        Transaction transaction = new Transaction();
        transaction.setEmployer(employer);
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setCreateDate(LocalDate.now());
        transaction.setTotal(totalAmount);
        transaction = transactionRepo.save(transaction);

        TransactionDetail transactionDetail = new TransactionDetail();
        transactionDetail.setTransaction(transaction);
        transactionDetail.setExpiryDate(calculateExpiryDate(postPackage.getDuration()));
        transactionDetail = transactionDetailRepo.save(transactionDetail);

        // ✅ THÊM PACKAGE VÀO TRANSACTION DETAIL
        postPackage.setTransactionDetail(transactionDetail);
        packageRepo.save(postPackage);

        return new PaymentResponseDTO(
                true,
                "Thanh toán thành công! Gói dịch vụ đã được kích hoạt.",
                transaction.getTransactionID(),
                totalAmount);
    }

    @Override
    @Transactional
    public PaymentResponseDTO activateFreePackage(ActivateFreePackageDTO request) {
        if (request.getPackageID() == null || request.getEmployerID() == null) {
            return new PaymentResponseDTO(false, "Thiếu thông tin packageID hoặc employerID", null, null);
        }

        PostPackage postPackage = packageRepo.findById(request.getPackageID())
                .orElseThrow(() -> new RuntimeException("Gói dịch vụ không tồn tại"));

        Employer employer = employerRepo.findById(request.getEmployerID())
                .orElseThrow(() -> new RuntimeException("Nhà tuyển dụng không tồn tại"));

        if (postPackage.getPrice().compareTo(BigDecimal.ZERO) != 0) {
            return new PaymentResponseDTO(
                    false,
                    "Đây không phải gói miễn phí. Vui lòng sử dụng API thanh toán.",
                    null, null);
        }

        List<Transaction> existingFreeTransactions = transactionRepo
                .findActiveFreeByEmployer(employer.getEmployerID());
        if (!existingFreeTransactions.isEmpty()) {
            return new PaymentResponseDTO(false, "Bạn đã sử dụng gói miễn phí rồi!", null, null);
        }

        Transaction transaction = new Transaction();
        transaction.setEmployer(employer);
        transaction.setPaymentMethod("FREE");
        transaction.setCreateDate(LocalDate.now());
        transaction.setTotal(BigDecimal.ZERO);
        transaction = transactionRepo.save(transaction);

        TransactionDetail transactionDetail = new TransactionDetail();
        transactionDetail.setTransaction(transaction);
        transactionDetail.setExpiryDate(calculateExpiryDate(postPackage.getDuration()));
        transactionDetail = transactionDetailRepo.save(transactionDetail);

        // THÊM PACKAGE VÀO TRANSACTION DETAIL
        postPackage.setTransactionDetail(transactionDetail);
        packageRepo.save(postPackage);

        return new PaymentResponseDTO(
                true,
                "🎉 Gói miễn phí đã được kích hoạt thành công!",
                transaction.getTransactionID(),
                BigDecimal.ZERO);
    }

    @Override
    public List<ActivePackageDTO> getActivePackages(Integer employerID) {
        return transactionDetailRepo
               .findActiveByEmployer(employerID, LocalDate.now())
               .stream()
               .flatMap(td -> td.getPostPackages().stream()
                       .map(pkg -> new ActivePackageDTO(
                               pkg.getPackageID(),
                               pkg.getPackageName(),
                               td.getExpiryDate()
                       ))
               )
               .collect(Collectors.toList());
    }
}