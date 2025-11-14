package vn.iotstar.service;

import vn.iotstar.dto.EmployerDashboardStatsDTO;

public interface IEmployerDashboardService {
    EmployerDashboardStatsDTO getEmployerStats(Integer employerAccountId);
}