package vn.iotstar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankCardResponseDTO {
    private boolean success;
    private String cardHolderName;
    private String bankName;
    private String message;
}
