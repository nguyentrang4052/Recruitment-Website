package vn.iotstar.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivePackageDTO {
    private Integer packageID;
    private String packageName;
    private LocalDate expiryDate;
}