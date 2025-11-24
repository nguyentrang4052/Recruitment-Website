package vn.iotstar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {
    private Integer totalUsers;
    private Integer totalApplicants;
    private Integer totalEmployers;
    private Integer totalRecruitmentNews;
    private RecruitmentNewsStatsDTO recruitmentNewsStats;
    private UserStatsDTO userStats;
}
