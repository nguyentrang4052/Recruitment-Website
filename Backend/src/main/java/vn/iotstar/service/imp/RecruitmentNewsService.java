package vn.iotstar.service.imp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;  
import vn.iotstar.enums.EFormOfWork;
import vn.iotstar.dto.RecruitmentNewsDTO;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.entity.Employer;
import vn.iotstar.entity.EmployerPackageLimit;
import vn.iotstar.enums.EStatus;
import vn.iotstar.repository.IRecruitmentNewsRepository;
import vn.iotstar.repository.IViewLogRepository;
import vn.iotstar.repository.IEmployerPackageLimitRepository;
import vn.iotstar.repository.IEmployerRepository;
import vn.iotstar.service.IRecruitmentNewsService;
import vn.iotstar.service.ISkillService;

@Service
public class RecruitmentNewsService implements IRecruitmentNewsService {

    @Autowired
    private IRecruitmentNewsRepository recruitmentRepo;
    
    @Autowired 
    private ISkillService skillService;
    
    @Autowired
    private IEmployerRepository employerRepository;
    
    @Autowired
    private IEmployerPackageLimitRepository employerLimitRepo;
    
    @Autowired
    private IViewLogRepository viewLogRepo;

    @Override
    @Transactional  
    public RecruitmentNews save(RecruitmentNewsDTO dto) {
    	
        EmployerPackageLimit limit = employerLimitRepo
                .findByEmployer_EmployerID(dto.getEmployerID())
                .orElseThrow(() -> new RuntimeException("Bạn chưa kích hoạt gói dịch vụ nào."));

        if (limit.getPostsLeft() != null && limit.getPostsLeft() <= 0) {
            throw new RuntimeException("Bạn đã hết lượt đăng tin trong gói hiện tại.");
        }

        if (limit.getExpiryDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Gói dịch vụ của bạn đã hết hạn.");
        }

        // Trừ 1 lượt
        employerLimitRepo.decrementPostsLeft(dto.getEmployerID());
         
        RecruitmentNews news = new RecruitmentNews();
        mapDtoToEntity(dto, news);

        Employer employer = employerRepository.findById(dto.getEmployerID())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy employer với ID: " + dto.getEmployerID()));
        news.setEmployer(employer);

        news.setPostedAt(LocalDate.now());
        news.setNumbersOfViews(0);
        news.setNumbersOfRecords(0);
        news.setStatus(EStatus.PENDING);

        return recruitmentRepo.save(news);
    }

    @Override
    public List<RecruitmentNews> findAll() {
        return recruitmentRepo.findAll();
    }

    @Override
    public Optional<RecruitmentNews> findById(Integer id) {
        return recruitmentRepo.findById(id);
    }

    @Override
    @Transactional  
    public RecruitmentNews update(Integer id, RecruitmentNewsDTO dto) {
        RecruitmentNews existing = recruitmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng"));
        mapDtoToEntity(dto, existing);
        return recruitmentRepo.save(existing);
    }

    @Override
    @Transactional  
    public void delete(Integer id) {
    	viewLogRepo.deleteByJobId(id);
        recruitmentRepo.deleteById(id);
    }

    private void mapDtoToEntity(RecruitmentNewsDTO dto, RecruitmentNews entity) {
        entity.setPosition(dto.getPosition());
        entity.setDescription(dto.getDescription());
        entity.setBenefit(dto.getBenefit());
        entity.setLocation(dto.getLocation());
        entity.setFormOfWork(mapFormOfWork(dto.getFormOfWork()));
        entity.setWorkingTime(dto.getWorkingTime());
        entity.setApplyBy(dto.getApplyBy());
        entity.setDeadline(dto.getDeadline());
        entity.setMinSalary(dto.getMinSalary());
        entity.setMaxSalary(dto.getMaxSalary());
        entity.setLiteracy(dto.getLiteracy());
        entity.setExperience(dto.getExperience());
        entity.setLevel(dto.getLevel());

        if (dto.getRequirements() != null && !dto.getRequirements().isEmpty()) {
            entity.setSkill(skillService.findOrCreateSkills(dto.getRequirements()));
        } else {
            entity.setSkill(null); 
        }
    }

    private EFormOfWork mapFormOfWork(String formOfWork) {
        if (formOfWork == null || formOfWork.isEmpty()) return null;

        String normalized = formOfWork.trim().replace("-", "_").replace(" ", "_").toUpperCase();

        try {
            return EFormOfWork.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Giá trị formOfWork không hợp lệ: " + formOfWork);
        }
    }
}