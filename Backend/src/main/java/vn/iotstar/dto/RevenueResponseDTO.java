package vn.iotstar.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueResponseDTO {
    private RevenueSummaryDTO summary;
    private List<RevenuePerMonthDTO> monthly;
    private List<RevenueByPackageDTO> byPackage;
}