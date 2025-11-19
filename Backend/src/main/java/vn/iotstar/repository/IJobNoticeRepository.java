package vn.iotstar.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import io.lettuce.core.dynamic.annotation.Param;
import vn.iotstar.entity.JobNotice;
import vn.iotstar.enums.EFrequency;

@Repository
public interface IJobNoticeRepository extends JpaRepository<JobNotice, Integer> {

	List<JobNotice> findByApplicant_ApplicantIDAndIsActiveTrue(Integer applicantID);

	@Query("SELECT n FROM JobNotice n WHERE n.isActive = true " + "AND n.frequency = :frequency "
			+ "AND (n.lastSentDate IS NULL OR n.lastSentDate < :cutoffDate)")
	List<JobNotice> findNoticeDueForSending(@Param("frequency") EFrequency frequency,
			@Param("cutoffDate") LocalDate cutoffDate);

}
