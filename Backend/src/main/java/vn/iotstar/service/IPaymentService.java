package vn.iotstar.service;

import vn.iotstar.dto.BankCardDTO;
import vn.iotstar.dto.BankCardResponseDTO;
import vn.iotstar.dto.PaymentRequestDTO;
import vn.iotstar.dto.PaymentResponseDTO;
import vn.iotstar.dto.QRCodeRequestDTO;
import vn.iotstar.dto.QRCodeResponseDTO;


public interface IPaymentService {
    
    BankCardResponseDTO getCardHolderInfo(BankCardDTO request);
   
    QRCodeResponseDTO generateQRCode(QRCodeRequestDTO request);
    
    PaymentResponseDTO verifyQRPayment(String transactionRef, Integer employerID);
    
    PaymentResponseDTO processBankTransfer(PaymentRequestDTO request);
}