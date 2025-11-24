package vn.iotstar.service.imp;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import vn.iotstar.dto.NewApplicantResponseDTO;
import vn.iotstar.dto.applicant.ApplyRequestDTO;
import vn.iotstar.entity.Account;
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.Application;
import vn.iotstar.entity.CareerInformation;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.entity.Skill;
import vn.iotstar.enums.EStatus;
import vn.iotstar.repository.IAccountRepository;
import vn.iotstar.repository.IApplicantRepository;
import vn.iotstar.repository.IApplicationRepository;
import vn.iotstar.repository.IRecruitmentRepository;
import vn.iotstar.service.IApplicantService;
import vn.iotstar.service.IApplicationService;

@Service
public class ApplicationService implements IApplicationService {

    @Autowired
    private IAccountRepository accountRepository;

    @Autowired
    private IApplicantRepository applicantRepository;

    @Autowired
    private IApplicantService applicantService;

    @Autowired
    private IRecruitmentRepository recruitmentRepo;

    @Autowired
    private IApplicationRepository apRepository;


	@Override
	@Transactional
	public Application apply(MultipartFile cvFile, ApplyRequestDTO dto, String username) {
		Account account = accountRepository.findByUsername(username);
		if (account == null) {
			String email = username;
			account = accountRepository.findByEmail(email);
		}
		;

		Applicant a = applicantService.findByAccount_accountID(account.getAccountID());
		if (a == null)
			throw new EntityNotFoundException("Applicant not found for account id: " + account.getAccountID());

        Integer RNID = dto.getRNID();
        Optional<RecruitmentNews> reNews = recruitmentRepo.findById(RNID);


		boolean alreadyApplied = apRepository.existsByApplicantAndRecruitmentNews(a, reNews.get());
		if (alreadyApplied)
			throw new IllegalStateException("You have already applied for this job.");
		else {
			Application application = new Application();
			application.setRecruitmentNews(reNews.get());
			application.setApplicant(a);
			application.setStatus(EStatus.PENDING);
			application.setNote(dto.getCoverLetter());
			String fileName = applicantService.storeFile(cvFile);
			application.setCV(fileName);
			return apRepository.save(application);
		}

	}

	@Override
	public Application findByApplicant_ApplicantIDAndRecruitmentNews_RNID(Integer applicantID, Integer RNID) {
		return apRepository.findByApplicant_ApplicantIDAndRecruitmentNews_RNID(applicantID, RNID);
	}


    
	@Override
	public List<NewApplicantResponseDTO> getNewApplicantsByRecruitmentNewsId(Integer recruitmentNewsId) {
	    RecruitmentNews recruitmentNews = recruitmentRepo.findById(recruitmentNewsId)
	            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tin tuyển dụng ID: " + recruitmentNewsId));

	    // ✅ LẤY CẢ PENDING VÀ APPROVED
	    List<EStatus> statuses = List.of(EStatus.PENDING, EStatus.APPROVED);
	    List<Application> applications = apRepository.findApplicationsWithDetailsByStatuses(recruitmentNewsId, statuses);

	    return applications.stream().map(app -> {
	        Applicant applicant = app.getApplicant();
	        CareerInformation careerInfo = applicant.getCareerInformation();

	        List<String> skillNames = applicant.getSkill().stream()
	                .map(Skill::getSkillName)
	                .collect(Collectors.toList());

	        String position = careerInfo != null ? careerInfo.getTitle() : "Chưa cập nhật";
	        String location = careerInfo != null ? careerInfo.getLocation() : "Chưa cập nhật";

	        return new NewApplicantResponseDTO(
	                applicant.getApplicantID(),
	                applicant.getApplicantName(),
	                position,
	                location,
	                applicant.getExperience(),
	                skillNames,
	                app.getDate() != null ? app.getDate().toString() : "",
	                app.getStatus() != null ? app.getStatus().toString() : "PENDING",
	                app.getCV(),
	                applicant.getAccount() != null ? applicant.getAccount().getPhoto() : null,
	                recruitmentNewsId // ✅ ĐẢM BẢO TRẢ VỀ ĐÚNG recruitmentNewsId
	        );
	    }).collect(Collectors.toList());
	}

	@Override
	@Transactional
	public void approveApplicant(Integer recruitmentNewsId, Integer applicantId) {
	    apRepository.updateApplicationStatus(recruitmentNewsId, applicantId, EStatus.APPROVED);
	    Long activeCount = apRepository.countActiveApplicants(recruitmentNewsId);
	    RecruitmentNews rn = recruitmentRepo.findById(recruitmentNewsId)
	            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tin ID: " + recruitmentNewsId));
	    rn.setNumbersOfRecords(activeCount.intValue());
	    recruitmentRepo.save(rn);
	}

    @Override
    @Transactional
    public void rejectApplicant(Integer recruitmentNewsId, Integer applicantId) {
    	apRepository.deleteApplicationByCompositeKey(recruitmentNewsId, applicantId);

        
        Long activeCount = apRepository.countActiveApplicants(recruitmentNewsId);
        RecruitmentNews rn = recruitmentRepo.findById(recruitmentNewsId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tin ID: " + recruitmentNewsId));
        rn.setNumbersOfRecords(activeCount.intValue());
        recruitmentRepo.save(rn);
    }

}
