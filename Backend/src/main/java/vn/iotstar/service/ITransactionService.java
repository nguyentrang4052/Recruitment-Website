package vn.iotstar.service;

import vn.iotstar.dto.PaymentRequestDTO;
import vn.iotstar.dto.PaymentResponseDTO;

import java.util.List;

import vn.iotstar.dto.ActivateFreePackageDTO;
import vn.iotstar.dto.ActivePackageDTO;

public interface ITransactionService {
    PaymentResponseDTO processPayment(PaymentRequestDTO request);
    
    PaymentResponseDTO activateFreePackage(ActivateFreePackageDTO request);
    
    List<ActivePackageDTO> getActivePackages(Integer employerID);
}