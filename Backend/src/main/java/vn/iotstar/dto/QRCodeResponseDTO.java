package vn.iotstar.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QRCodeResponseDTO {
    private boolean success;
    private String qrCodeData;
    private String bankAccount;
    private String bankName;
    private String accountName;
    private BigDecimal amount;
    private String content;
    private String message;
}