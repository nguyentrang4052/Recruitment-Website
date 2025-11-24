package vn.iotstar.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.iotstar.dto.AdminDashboardDTO;
import vn.iotstar.dto.RecruitmentNewsStatsDTO;
import vn.iotstar.dto.UserStatsDTO;
import vn.iotstar.enums.EStatus;
import vn.iotstar.repository.IAccountRepository;
import vn.iotstar.repository.IApplicantRepository;
import vn.iotstar.repository.IEmployerRepository;
import vn.iotstar.repository.IRecruitmentNewsRepository;
import vn.iotstar.service.IAdminDashboardService;

@Service
public class AdminDashboardService implements IAdminDashboardService {

    @Autowired
    private IAccountRepository accountRepository;

    @Autowired
    private IApplicantRepository applicantRepository;

    @Autowired
    private IEmployerRepository employerRepository;

    @Autowired
    private IRecruitmentNewsRepository recruitmentNewsRepository;

    @Override
    public AdminDashboardDTO getDashboardStats() {
        AdminDashboardDTO dashboard = new AdminDashboardDTO();
        dashboard.setUserStats(getUserStats());
        dashboard.setRecruitmentNewsStats(getRecruitmentNewsStats());
        
        UserStatsDTO userStats = dashboard.getUserStats();
        dashboard.setTotalUsers(userStats.getTotalAccounts());
        dashboard.setTotalApplicants(userStats.getTotalApplicants());
        dashboard.setTotalEmployers(userStats.getTotalEmployers());
        
        RecruitmentNewsStatsDTO newsStats = dashboard.getRecruitmentNewsStats();
        dashboard.setTotalRecruitmentNews(newsStats.getTotalRecruitmentNews());
        
        return dashboard;
    }

    @Override
    public UserStatsDTO getUserStats() {
        UserStatsDTO userStats = new UserStatsDTO();
        userStats.setTotalAccounts(accountRepository.countTotalAccounts().intValue());
        userStats.setTotalApplicants(applicantRepository.countTotalApplicants().intValue());
        userStats.setTotalEmployers(employerRepository.countTotalEmployers().intValue());
        return userStats;
    }

    @Override
    public RecruitmentNewsStatsDTO getRecruitmentNewsStats() {
        RecruitmentNewsStatsDTO newsStats = new RecruitmentNewsStatsDTO();
        newsStats.setTotalRecruitmentNews(
            recruitmentNewsRepository.countTotalRecruitmentNews().intValue()
        );
        newsStats.setApprovedCount(
            recruitmentNewsRepository.countByStatus(EStatus.APPROVED).intValue()
        );
        newsStats.setPendingCount(
            recruitmentNewsRepository.countByStatus(EStatus.PENDING).intValue()
        );
        newsStats.setRejectedCount(
            recruitmentNewsRepository.countByStatus(EStatus.REJECTED).intValue()
        );
        return newsStats;
    }
}