package vn.iotstar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerDashboardStatsDTO {
    private Long newApplicantsCount;      // Ứng viên mới (7 ngày qua)
    private Long activeJobsCount;         // Tin tuyển dụng đang hoạt động
    private Long weeklyProfileViews;      // Lượt xem hồ sơ tuần này
}