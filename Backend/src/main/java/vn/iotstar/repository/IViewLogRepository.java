package vn.iotstar.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.iotstar.entity.ViewLog;

@Repository
public interface IViewLogRepository extends JpaRepository<ViewLog, Integer> {
    
    @Query("SELECT COUNT(v) FROM ViewLog v WHERE v.reNews.RNID = :rnid")
    Integer countView(@Param("rnid") Integer rnid);
    
    @Query("select count(v) from ViewLog v join v.reNews rn " +
		       "where rn.employer.account.accountID = :employerAccountId " +
		       "and v.viewDate >= :sinceDate")
		Long countViewsByEmployerSince(
		        @Param("employerAccountId") Integer employerAccountId,
		        @Param("sinceDate") LocalDate sinceDate);

	@Modifying
	@Query("DELETE FROM ViewLog v WHERE v.reNews.RNID = :rnId")
	void deleteByRecruitmentNews_RNID(@Param("rnId") Integer rnId);

	
	Long countByReNews_RNID(Integer rnid);

 boolean existsByReNews_RNIDAndApplicant_ApplicantID(Integer rnid, Integer applicantID);
 
 
 /* Lượt xem theo ngày (trong 7 ngày gần nhất) */
 @Query(value = """
 	    SELECT TO_CHAR(v.view_date, 'Dy')  AS day,   
 	           COUNT(v) AS views
 	    FROM  view_log v
 	    JOIN  recruitment_news r ON r.rnid = v.rnid
 	    JOIN  employer e ON e.employerid = r.employerid
 	    WHERE e.accountid = :employerAccountId
 	      AND v.view_date >= :fromDate
 	    GROUP BY TO_CHAR(v.view_date, 'Dy')
 	    ORDER BY MIN(v.view_date)
 	    """, nativeQuery = true)
 	List<Object[]> countViewsLast7Days(@Param("employerAccountId") Integer employerAccountId,
 	                                   @Param("fromDate") LocalDate fromDate);
 	
 	@Modifying
    @Transactional
    @Query("DELETE FROM ViewLog v WHERE v.reNews.RNID = :jobId")
    void deleteByJobId(@Param("jobId") Integer jobId);
}