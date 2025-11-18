package vn.iotstar.controller;

import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.iotstar.dto.*;
import vn.iotstar.service.IPaymentService;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/employer/payment")
@PreAuthorize("hasAuthority('ROLE_employer')")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class PaymentController {

    private final IPaymentService paymentService;
    private final RestTemplate restTemplate;
   
    @PostMapping("/card-info")
    public ResponseEntity<BankCardResponseDTO> getCardHolderInfo(@RequestBody BankCardDTO request) {
        BankCardResponseDTO response = paymentService.getCardHolderInfo(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/banks")
    public ResponseEntity<?> getBanks() {
        String url = "https://api.vietqr.io/v2/banks";
        try {
            ResponseEntity<Map> res = restTemplate.getForEntity(url, Map.class);
            return ResponseEntity.ok(res.getBody());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Không thể tải danh sách ngân hàng"));
        }
    }

    @PostMapping("/generate-qr")
    public ResponseEntity<QRCodeResponseDTO> generateQRCode(@RequestBody QRCodeRequestDTO request) {
        QRCodeResponseDTO response = paymentService.generateQRCode(request);
        return ResponseEntity.ok(response);
    }

  
    @PostMapping("/verify-qr")
    public ResponseEntity<PaymentResponseDTO> verifyQRPayment(
            @RequestParam String transactionRef,
            @RequestParam Integer employerID) {
        PaymentResponseDTO response = paymentService.verifyQRPayment(transactionRef, employerID);
        return ResponseEntity.ok(response);
    }

  
    @PostMapping("/bank-transfer")
    public ResponseEntity<PaymentResponseDTO> processBankTransfer(@RequestBody PaymentRequestDTO request) {
        PaymentResponseDTO response = paymentService.processBankTransfer(request);
        return ResponseEntity.ok(response);
    }
}