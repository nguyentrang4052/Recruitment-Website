package vn.iotstar.service.imp;

import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.iotstar.dto.EmployerDashboardStatsDTO;
import vn.iotstar.enums.EStatus;
import vn.iotstar.repository.IApplicationRepository;
import vn.iotstar.repository.IRecruitmentNewsRepository;
import vn.iotstar.repository.IViewLogRepository; // THÊM
import vn.iotstar.service.IEmployerDashboardService;

@Service
@Transactional
public class EmployerDashboardService implements IEmployerDashboardService {
    
    @Autowired
    private IApplicationRepository applicationRepo;
    
    @Autowired
    private IRecruitmentNewsRepository recruitmentNewsRepo;
    
    @Autowired
    private IViewLogRepository viewLogRepo; 
    
    @Override
    public EmployerDashboardStatsDTO getEmployerStats(Integer employerAccountId) {
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        
        Long newApplicants = applicationRepo.countNewApplicantsSince(employerAccountId, sevenDaysAgo);
        Long activeJobs = recruitmentNewsRepo.countActiveJobsByEmployer(employerAccountId, EStatus.APPROVED);
        
    

//        Long weeklyViews = viewLogRepo.countViewsByEmployerSince(employerAccountId, sevenDaysAgo);
        
        return new EmployerDashboardStatsDTO(
            newApplicants != null ? newApplicants : 0L,
            activeJobs != null ? activeJobs : 0L,
            weeklyViews != null ? weeklyViews : 0L 
        );
    }
}