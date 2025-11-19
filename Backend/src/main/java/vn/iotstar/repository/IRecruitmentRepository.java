package vn.iotstar.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.annotation.ParametersAreNonnullByDefault;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.enums.EFormOfWork;

@Repository
public interface IRecruitmentRepository extends JpaRepository<RecruitmentNews, Integer> {

	@Query("SELECT r FROM RecruitmentNews r " + "WHERE r.RNID <> :id "
			+ "AND (r.position ILIKE CONCAT('%', :position, '%') OR r.location = :location OR r.formOfWork = :formOfWork) "
			+ "AND r.deadline >= CURRENT_DATE " + "ORDER BY r.deadline ASC")
	List<RecruitmentNews> findRelatedJobs(@Param("position") String positon, @Param("location") String location,
			@Param("formOfWork") EFormOfWork formOfWork, @Param("id") Integer id);

	@Query("SELECT COUNT(r) FROM RecruitmentNews r WHERE r.employer.employerID = :id AND r.status = 'APPROVED' AND r.deadline >= CURRENT_DATE")
	Integer countApprovedJobs(@Param("id") Integer id);

	List<RecruitmentNews> findByEmployer_EmployerID(Integer id);

	@Query("SELECT r FROM RecruitmentNews r JOIN r.skill s WHERE LOWER(s.skillName) = LOWER(:skillName) AND r.status = 'APPROVED' AND r.deadline >= CURRENT_DATE")
	List<RecruitmentNews> findBySkill_SkillName(@Param("skillName") String skillName);

	@Query("SELECT r FROM RecruitmentNews r WHERE LOWER(r.position) LIKE LOWER(CONCAT('%', :position, '%')) AND r.status = 'APPROVED' AND r.deadline >= CURRENT_DATE")
	List<RecruitmentNews> findByPosition(@Param("position") String position);

	@Query("SELECT r FROM RecruitmentNews r WHERE LOWER(r.level)= LOWER(:level) AND r.status = 'APPROVED'")
	List<RecruitmentNews> findByLevel(String level);

	@Query("SELECT r FROM RecruitmentNews r WHERE LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%')) AND r.status = 'APPROVED' AND r.deadline >= CURRENT_DATE")
	List<RecruitmentNews> findByLocation(String location);
	
	List<RecruitmentNews> findByApplication_Applicant_ApplicantID(Integer id);
	
	
	@Query("SELECT r FROM RecruitmentNews r WHERE r.status = 'APPROVED' AND r.deadline >= CURRENT_DATE" +
		       " AND r.minSalary >= :minSalary" +
		       " AND (:maxSalary IS NULL OR r.maxSalary <= :maxSalary)")
		List<RecruitmentNews> findBySalary(@Param("minSalary") BigDecimal minSalary, 
		                                           @Param("maxSalary") BigDecimal maxSalary);
	
	@Query("SELECT r FROM RecruitmentNews r WHERE r.status = 'APPROVED' AND r.deadline >= CURRENT_DATE")
	List<RecruitmentNews> findAllNews();
	
	
	@Query("""
		    SELECT r FROM RecruitmentNews r
		    WHERE r.deadline >= CURRENT_DATE
		      AND (:lastSentDate IS NULL OR r.postedAt > :lastSentDate)
		      AND (COALESCE(:jobTitle, '') = '' OR LOWER(r.position) LIKE LOWER(CONCAT('%', :jobTitle, '%')))
		      AND (COALESCE(:location, '') = '' OR r.location LIKE CONCAT('%', :location, '%'))
		      AND (COALESCE(:level, '') = '' OR r.level = :level)
		      AND (
		            COALESCE(:salaryRange, '') = ''
		            OR (:salaryRange = 'duoi1'  AND r.maxSalary < 1000000)
		            OR (:salaryRange = '2-4'   AND r.minSalary >= 2000000 AND r.maxSalary <= 4000000)
		            OR (:salaryRange = '4-10'  AND r.minSalary >= 4000000 AND r.maxSalary <= 10000000)
		            OR (:salaryRange = '10-20' AND r.minSalary >= 10000000 AND r.maxSalary <= 20000000)
		            OR (:salaryRange = 'tren20' AND r.maxSalary > 20000000)
		      )
		    ORDER BY r.postedAt DESC
		""")
		List<RecruitmentNews> findMatchingJobs(
		        @Param("jobTitle") String jobTitle,
		        @Param("location") String location,
		        @Param("salaryRange") String salaryRange,
		        @Param("level") String level,
		        @Param("lastSentDate") LocalDate lastSentDate
		);


}
