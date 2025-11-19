package vn.iotstar.service.imp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import vn.iotstar.dto.applicant.EmployerCardDTO;
import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.Application;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.entity.Skill;
import vn.iotstar.repository.IApplicationRepository;
import vn.iotstar.repository.IRecruitmentRepository;
import vn.iotstar.service.IApplicantService;
import vn.iotstar.service.IApplicationService;
import vn.iotstar.service.IRecruitmentService;

@Service
public class RecruitmentService implements IRecruitmentService {

	@Autowired
	private IRecruitmentRepository recruitmentRepository;
	
	@Autowired
	private IApplicationService appService;

	@Override
	public List<RecruitmentNews> findAll() {
		return recruitmentRepository.findAll();
	}

	@Override
	public List<RecruitmentNews> findAllNews() {
		return recruitmentRepository.findAllNews();
	}

	@Override
	public Optional<RecruitmentNews> findById(Integer id) {
		return recruitmentRepository.findById(id);
	}

	@Override
	public Integer countApprovedJobs(Integer id) {
		return recruitmentRepository.countApprovedJobs(id);
	}

	@Override
	public RecruitmentCardDTO mapToDetail(RecruitmentNews rn) {
		String salary = (rn.getMinSalary() != null && rn.getMaxSalary() != null)
				? rn.getMinSalary() + " VND" + " - " + rn.getMaxSalary() + " VND"
				: "Thỏa thuận";

		EmployerCardDTO emp = new EmployerCardDTO(rn.getEmployer().getEmployerName(), rn.getEmployer().getCompanyLogo(),
				countApprovedJobs(rn.getEmployer().getEmployerID()), rn.getEmployer().getAddress(), rn.getEmployer().getFullName());

		List<String> skillNames = rn.getSkill().stream().map(Skill::getSkillName).toList();
		

		return new RecruitmentCardDTO(rn.getRNID(), rn.getPosition(), emp, salary, rn.getLocation(), rn.getDeadline(),
				rn.getPostedAt(), skillNames, rn.getStatus(), rn.getDescription(), rn.getExperience(), rn.getLiteracy(),
				rn.getLevel(), rn.getOther(), rn.getBenefit(), rn.getFormOfWork(), rn.getWorkingTime(),
				rn.getApplyBy());
	}
	

	@Override
	public RecruitmentCardDTO mapToApplication(Applicant applicant, RecruitmentNews rn) {
		String salary = (rn.getMinSalary() != null && rn.getMaxSalary() != null)
				? rn.getMinSalary() + " VND" + " - " + rn.getMaxSalary() + " VND"
				: "Thỏa thuận";

		EmployerCardDTO emp = new EmployerCardDTO(rn.getEmployer().getEmployerName(), rn.getEmployer().getCompanyLogo(),
				countApprovedJobs(rn.getEmployer().getEmployerID()), rn.getEmployer().getAddress(), rn.getEmployer().getFullName());

		List<String> skillNames = rn.getSkill().stream().map(Skill::getSkillName).toList();
		
		Application application = appService.findByApplicant_ApplicantIDAndRecruitmentNews_RNID(applicant.getApplicantID(), rn.getRNID());
		
		
		return new RecruitmentCardDTO(rn.getRNID(), rn.getPosition(), emp, salary, rn.getLocation(), rn.getDeadline(),
				rn.getPostedAt(), skillNames, rn.getStatus(), rn.getDescription(), rn.getExperience(), rn.getLiteracy(),
				rn.getLevel(), rn.getOther(), rn.getBenefit(), rn.getFormOfWork(), rn.getWorkingTime(),
				rn.getApplyBy(), application);
	}

	@Override
	public List<RecruitmentNews> getRelateJob(Integer id) {
		RecruitmentNews reNews = recruitmentRepository.findById(id).get();
		return recruitmentRepository.findRelatedJobs(reNews.getPosition(), reNews.getLocation(), reNews.getFormOfWork(),
				id);
	}

	@Override
	public List<RecruitmentNews> findByEmployer_EmployerID(Integer id) {
		return recruitmentRepository.findByEmployer_EmployerID(id);
	}

	@Override
	public List<RecruitmentNews> findBySkill_SkillName(String skillName) {
		return recruitmentRepository.findBySkill_SkillName(skillName);
	}

	@Override
	public List<RecruitmentNews> findByPosition(String position) {
		return recruitmentRepository.findByPosition(position);
	}

	@Override
	public List<RecruitmentNews> findByLevel(String level) {
		return recruitmentRepository.findByLevel(level);
	}

	@Override
	public List<RecruitmentNews> findByLocation(String location) {
		return recruitmentRepository.findByLocation(location);
	}

	@Override
	public List<RecruitmentNews> findByApplication_Applicant_ApplicantID(Integer id) {
		return recruitmentRepository.findByApplication_Applicant_ApplicantID(id);
	}

	@Override
	public List<RecruitmentNews> findBySalary(BigDecimal minSalary, BigDecimal maxSalary) {
		return recruitmentRepository.findBySalary(minSalary, maxSalary);
	}

	@Override
	public List<RecruitmentNews> findMatchingJobs(String jobTitle, String location, String salaryRange, String level,
			LocalDate lastSentDate) {
		return recruitmentRepository.findMatchingJobs(jobTitle, location, salaryRange, level, lastSentDate);
	}


	
}
