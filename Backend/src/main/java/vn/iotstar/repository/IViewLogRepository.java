package vn.iotstar.repository;

import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.iotstar.entity.ViewLog;

@Repository
public interface IViewLogRepository extends JpaRepository<ViewLog, Integer> {
    
	@Query("select count(v) from ViewLog v join v.reNews rn " +
		       "where rn.employer.account.accountID = :employerAccountId " +
		       "and v.viewDate >= :sinceDate")
		Long countViewsByEmployerSince(
		        @Param("employerAccountId") Integer employerAccountId,
		        @Param("sinceDate") LocalDate sinceDate);

	@Modifying
	@Query("DELETE FROM ViewLog v WHERE v.reNews.RNID = :rnId")
	void deleteByRecruitmentNews_RNID(@Param("rnId") Integer rnId);
}