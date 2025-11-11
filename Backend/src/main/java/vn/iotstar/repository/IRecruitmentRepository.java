package vn.iotstar.repository;

import java.util.List;

import javax.annotation.ParametersAreNonnullByDefault;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.enums.EFormOfWork;

@Repository
public interface IRecruitmentRepository extends JpaRepository<RecruitmentNews, Integer> {

	@Query("SELECT r FROM RecruitmentNews r " + "WHERE r.RNID <> :id "
			+ "AND (r.position ILIKE CONCAT('%', :position, '%') OR r.location = :location OR r.formOfWork = :formOfWork) "
			+ "AND r.deadline >= CURRENT_DATE " + "ORDER BY r.deadline ASC")
	List<RecruitmentNews> findRelatedJobs(@Param("position") String positon, @Param("location") String location,
			@Param("formOfWork") EFormOfWork formOfWork, @Param("id") Integer id);

	@Query("SELECT COUNT(r) FROM RecruitmentNews r WHERE r.employer.employerID = :id AND r.status = 'APPROVED'")
	Integer countApprovedJobs(@Param("id") Integer id);

	List<RecruitmentNews> findByEmployer_EmployerID(Integer id);

	@Query("SELECT r FROM RecruitmentNews r JOIN r.skill s WHERE LOWER(s.skillName) = LOWER(:skillName) AND r.status = 'APPROVED'")
	List<RecruitmentNews> findBySkill_SkillName(@Param("skillName") String skillName);

	@Query("SELECT r FROM RecruitmentNews r WHERE LOWER(r.position) LIKE LOWER(CONCAT('%', :position, '%')) AND r.status = 'APPROVED'")
	List<RecruitmentNews> findByPosition(@Param("position") String position);

	@Query("SELECT r FROM RecruitmentNews r WHERE LOWER(r.level)= LOWER(:level) AND r.status = 'APPROVED'")
	List<RecruitmentNews> findByLevel(String level);

	@Query("SELECT r FROM RecruitmentNews r WHERE LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%')) AND r.status = 'APPROVED'")
	List<RecruitmentNews> findByLocation(String location);
	
	List<RecruitmentNews> findByApplication_Applicant_ApplicantID(Integer id);
}
