package vn.iotstar.service.imp;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import vn.iotstar.dto.applicant.ApplyRequestDTO;
import vn.iotstar.entity.Account;
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.Application;
import vn.iotstar.entity.RecruitmentNews;
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
		};
		
		Applicant a = applicantService.findByAccount_accountID(account.getAccountID());
		if (a == null)
			throw new EntityNotFoundException("Applicant not found for account id: " + account.getAccountID());

		Integer RNID = dto.getRNID();
		Optional<RecruitmentNews> reNews = recruitmentRepo.findById(RNID);

		boolean alreadyApplied = apRepository.existsByApplicantAndRecruitmentNews(a, reNews.get());
		if (alreadyApplied)
			throw new IllegalStateException("You have already applied for this job.");

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
