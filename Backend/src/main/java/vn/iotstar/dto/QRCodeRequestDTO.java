package vn.iotstar.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QRCodeRequestDTO {
    private Integer packageID;   
    private Integer employerID;  
    private BigDecimal amount;
    private String description;
    private String currency;
}