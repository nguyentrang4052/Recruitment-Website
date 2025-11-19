package vn.iotstar.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.enums.EStatus;

public interface IRecruitmentService {

	List<RecruitmentNews> findAll();

	Optional<RecruitmentNews> findById(Integer id);

	RecruitmentCardDTO mapToDetail(RecruitmentNews rn);

	List<RecruitmentNews> getRelateJob(Integer id);

	Integer countApprovedJobs(Integer id);

	List<RecruitmentNews> findByEmployer_EmployerID(Integer id);

	List<RecruitmentNews> findByLocation(String location);

	List<RecruitmentNews> findByLevel(String level);

	List<RecruitmentNews> findByPosition(String position);

	List<RecruitmentNews> findBySkill_SkillName(String skillName);

	List<RecruitmentNews> findByApplication_Applicant_ApplicantID(Integer id);

	RecruitmentCardDTO mapToApplication(Applicant applicant, RecruitmentNews rn);


	List<RecruitmentNews> findAllNews();

	List<RecruitmentNews> findBySalary(BigDecimal minSalary, BigDecimal maxSalary);

	List<RecruitmentNews> findMatchingJobs(String jobTitle, String location, String salaryRange, String level, LocalDate lastSentDate);

	boolean updateStatus(Integer id, EStatus status);

}
