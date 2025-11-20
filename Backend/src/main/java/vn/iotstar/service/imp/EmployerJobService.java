package vn.iotstar.service.imp;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.iotstar.dto.ActiveJobDTO;
import vn.iotstar.dto.JobDetailDTO;
import vn.iotstar.dto.ApplicationDTO;
import vn.iotstar.dto.SkillDTO;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.enums.EStatus;
import vn.iotstar.repository.IApplicationRepository;
import vn.iotstar.repository.IRecruitmentNewsRepository;
import vn.iotstar.repository.IViewLogRepository;
import vn.iotstar.service.IEmployerJobService;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployerJobService implements IEmployerJobService {

    private final IRecruitmentNewsRepository recruitmentRepository;
    private final IApplicationRepository applicationRepository;
    private final IViewLogRepository viewLogRepository;  

    @Override
    public Page<ActiveJobDTO> getActiveJobs(Integer employerAccountId, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<RecruitmentNews> recruitments = recruitmentRepository.findActiveJobsByEmployer(
            employerAccountId, EStatus.APPROVED, pageable);
        return recruitments.map(this::convertToActiveDTO);
    }

    @Override
    public JobDetailDTO getJobDetail(Integer jobId) {
        RecruitmentNews recruitment = recruitmentRepository.findByIdWithSkills(jobId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc"));
        return convertToDetailDTO(recruitment);
    }

    @Override
    @Transactional
    public JobDetailDTO updateJob(Integer jobId, Integer employerAccountId, JobDetailDTO updateDTO) {
        if (!recruitmentRepository.existsByIdAndEmployer(jobId, employerAccountId)) {
            throw new RuntimeException("Bạn không có quyền cập nhật công việc này");
        }

        RecruitmentNews recruitment = recruitmentRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc"));

        recruitment.setPosition(updateDTO.getTitle());
        recruitment.setDescription(updateDTO.getDescription());
        recruitment.setLocation(updateDTO.getLocation());
        recruitment.setExperience(updateDTO.getExperience());
        recruitment.setLiteracy(updateDTO.getLiteracy());
        recruitment.setLevel(updateDTO.getLevel());
        
        recruitment.setMinSalary(updateDTO.getMinSalary() != null ? 
            BigDecimal.valueOf(updateDTO.getMinSalary()) : null);
        recruitment.setMaxSalary(updateDTO.getMaxSalary() != null ? 
            BigDecimal.valueOf(updateDTO.getMaxSalary()) : null);
            
        recruitment.setBenefit(updateDTO.getBenefit());
        recruitment.setWorkingTime(updateDTO.getWorkingTime());
        recruitment.setApplyBy(updateDTO.getApplyBy());
        recruitment.setDeadline(updateDTO.getDeadline());
        recruitment.setQuantity(updateDTO.getQuantity());
      

        RecruitmentNews updated = recruitmentRepository.save(recruitment);
        return convertToDetailDTO(updated);
    }

    @Override
    @Transactional
    public void deleteJob(Integer jobId, Integer employerAccountId) {
        if (!recruitmentRepository.existsByIdAndEmployer(jobId, employerAccountId)) {
            throw new RuntimeException("Bạn không có quyền xóa công việc này");
        }

        Long applicantCount = applicationRepository.countByRecruitmentNews_RNID(jobId);
        if (applicantCount > 0) {
            throw new RuntimeException("Không thể xóa tin tuyển dụng đã có " + applicantCount + 
                " người ứng tuyển. Vui lòng sử dụng chức năng 'Ngừng tuyển' thay thế.");
        }

        recruitmentRepository.deleteById(jobId);
    }

    @Override
    @Transactional
    public void deactivateJob(Integer jobId, Integer employerAccountId) {
        int updated = recruitmentRepository.deactivateJob(jobId, employerAccountId);
        if (updated == 0) {
            throw new RuntimeException("Không tìm thấy tin tuyển dụng hoặc bạn không có quyền");
        }
    }

    private ActiveJobDTO convertToActiveDTO(RecruitmentNews recruitment) {
        ActiveJobDTO dto = new ActiveJobDTO();
        dto.setId(recruitment.getRNID());
        dto.setTitle(recruitment.getPosition());
        dto.setLocation(recruitment.getLocation());
        dto.setPostedDate(recruitment.getPostedAt());
        dto.setStatus(recruitment.getStatus().name());

        List<EStatus> includeStatuses = List.of(EStatus.PENDING, EStatus.APPROVED);
        Long applicantCount = applicationRepository.countByRecruitmentNews_RNIDAndStatusIn(
            recruitment.getRNID(), includeStatuses);
        dto.setApplicants(applicantCount != null ? applicantCount.intValue() : 0);

        return dto;
    }

    private JobDetailDTO convertToDetailDTO(RecruitmentNews recruitment) {
        JobDetailDTO dto = new JobDetailDTO();
        dto.setId(recruitment.getRNID());
        dto.setTitle(recruitment.getPosition());
        dto.setDescription(recruitment.getDescription());
        dto.setLocation(recruitment.getLocation());
        dto.setExperience(recruitment.getExperience());
        dto.setLiteracy(recruitment.getLiteracy());
        dto.setLevel(recruitment.getLevel());

        dto.setMinSalary(recruitment.getMinSalary() != null ? recruitment.getMinSalary().intValue() : null);
        dto.setMaxSalary(recruitment.getMaxSalary() != null ? recruitment.getMaxSalary().intValue() : null);

        dto.setBenefit(recruitment.getBenefit());
        dto.setFormOfWork(recruitment.getFormOfWork().name());
        dto.setWorkingTime(recruitment.getWorkingTime());
        dto.setApplyBy(recruitment.getApplyBy());
        dto.setPostedDate(recruitment.getPostedAt());
        dto.setDeadline(recruitment.getDeadline());
        dto.setQuantity(recruitment.getQuantity());
        
      
        if (recruitment.getIsActive() != null && !recruitment.getIsActive()) {
            dto.setStatus("INACTIVE");
        } else {
            dto.setStatus(recruitment.getStatus().name());
        }

        
        Long viewCount = viewLogRepository.countByReNews_RNID(recruitment.getRNID());
        dto.setNumbersOfViews(viewCount != null ? viewCount.intValue() : 0);

        Long applicants = applicationRepository.countByRecruitmentNews_RNID(recruitment.getRNID());
        dto.setNumbersOfRecords(applicants != null ? applicants.intValue() : 0);

        dto.setSkills(recruitment.getSkill().stream()
            .map(skill -> {
                SkillDTO skillDTO = new SkillDTO();
                skillDTO.setSkillID(skill.getSkillID());
                skillDTO.setSkillName(skill.getSkillName());
                return skillDTO;
            })
            .collect(Collectors.toList()));

        List<EStatus> statuses = List.of(EStatus.PENDING, EStatus.APPROVED, EStatus.REJECTED);
        List<ApplicationDTO> applicationDTOs = applicationRepository.findApplicationsWithDetailsByStatuses(recruitment.getRNID(), statuses)
            .stream()
            .map(app -> {
                ApplicationDTO aDto = new ApplicationDTO();
                aDto.setDate(app.getDate());
                aDto.setStatus(app.getStatus().name());
                aDto.setNote(app.getNote());
                aDto.setCV(app.getCV());
                aDto.setRecruitmentNewsTitle(app.getRecruitmentNews().getPosition());
                return aDto;
            })
            .collect(Collectors.toList());

        dto.setApplicants(applicationDTOs.size());

        return dto;
    }
}