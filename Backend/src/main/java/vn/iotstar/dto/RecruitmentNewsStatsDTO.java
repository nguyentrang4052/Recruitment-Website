package vn.iotstar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecruitmentNewsStatsDTO {
    private Integer totalRecruitmentNews;
    private Integer approvedCount;
    private Integer pendingCount;
    private Integer rejectedCount;
}