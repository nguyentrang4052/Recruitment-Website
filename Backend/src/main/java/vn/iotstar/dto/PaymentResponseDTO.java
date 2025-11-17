package vn.iotstar.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponseDTO {
    private boolean success;
    private String message;
    private Integer transactionID;
    private BigDecimal totalAmount;
}