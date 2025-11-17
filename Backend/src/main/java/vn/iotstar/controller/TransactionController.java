package vn.iotstar.controller;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.iotstar.dto.*;
import vn.iotstar.service.ITransactionService;

@RestController
@RequestMapping("/api/employer/transactions")
@PreAuthorize("hasAuthority('ROLE_employer')")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class TransactionController {

    private final ITransactionService transactionService;

    @PostMapping("/payment")
    public ResponseEntity<PaymentResponseDTO> processPayment(@RequestBody PaymentRequestDTO request) {
        PaymentResponseDTO response = transactionService.processPayment(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/activate-free")
    public ResponseEntity<PaymentResponseDTO> activateFreePackage(@RequestBody ActivateFreePackageDTO request) {
        PaymentResponseDTO response = transactionService.activateFreePackage(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<ActivePackageDTO>> getActivePackages(
            @RequestParam Integer employerID) {
        return ResponseEntity.ok(transactionService.getActivePackages(employerID));
    }
   
}