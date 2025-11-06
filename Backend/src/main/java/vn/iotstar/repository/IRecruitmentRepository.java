package vn.iotstar.repository;

import java.util.List;

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
}