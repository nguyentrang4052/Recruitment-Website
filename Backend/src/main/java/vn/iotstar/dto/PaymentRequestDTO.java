package vn.iotstar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDTO {
    private Integer packageID;
    private Integer employerID;
    private String paymentMethod; // BANK_TRANSFER, QR_CODE
    private String email;
    private String taxCode;
    private String companyName;
    
  
    private String bankId;
    private String accountHolder;
    private String accountNumber;
    private String cardNumber;
    private String transferDate;
    private String transferReference;
}

