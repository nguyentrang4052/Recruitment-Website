package vn.iotstar.service;

import vn.iotstar.dto.AdminDashboardDTO;
import vn.iotstar.dto.RecruitmentNewsStatsDTO;
import vn.iotstar.dto.UserStatsDTO;

public interface IAdminDashboardService {
	
    AdminDashboardDTO getDashboardStats();
    
    UserStatsDTO getUserStats();
    
    RecruitmentNewsStatsDTO getRecruitmentNewsStats();
}