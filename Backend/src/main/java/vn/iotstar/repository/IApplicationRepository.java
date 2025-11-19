package vn.iotstar.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.repository.query.Param;
import jakarta.transaction.Transactional;
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.Application;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.enums.EStatus;
import vn.iotstar.key.ApplicationID;

@Repository
public interface IApplicationRepository extends JpaRepository<Application, ApplicationID>{
	
	boolean existsByApplicantAndRecruitmentNews(Applicant applicant, RecruitmentNews reNews);
	
	Long countByRecruitmentNews_RNIDAndStatusIn(Integer rnId, List<EStatus> statuses);

	Application findByApplicant_ApplicantIDAndRecruitmentNews_RNID(Integer applicantID, Integer RNID);
	
	@Query("SELECT COUNT(a) FROM Application a " +
	           "JOIN a.recruitmentNews rn " +
	           "JOIN rn.employer e " +
	           "WHERE e.account.accountID = :employerAccountId " +
	           "AND a.date >= :sinceDate")
	    Long countNewApplicantsSince(
	        @Param("employerAccountId") Integer employerAccountId, 
	        @Param("sinceDate") LocalDate sinceDate);
	
	List<Application> findByRecruitmentNewsAndStatus(
	        RecruitmentNews recruitmentNews, 
	        EStatus status
	    );
	    
	   
	@Query("SELECT a FROM Application a " +
		       "JOIN FETCH a.recruitmentNews rn " +
		       "JOIN FETCH a.applicant ap " +
		       "LEFT JOIN FETCH ap.careerInformation ci " +
		       "LEFT JOIN FETCH ap.skill s " +
		       "WHERE a.recruitmentNews.RNID = :rnId " +
		       "AND a.status IN :statuses")
		List<Application> findApplicationsWithDetailsByStatuses(
		    @Param("rnId") Integer recruitmentNewsId,
		    @Param("statuses") List<EStatus> statuses
		);



		@Modifying
	    @Query("UPDATE Application a SET a.status = :status WHERE a.recruitmentNews.RNID = :rnId AND a.applicant.applicantID = :applicantId")
	    void updateApplicationStatus(@Param("rnId") Integer rnId, 
	                                 @Param("applicantId") Integer applicantId, 
	                                 @Param("status") EStatus status);
	    

	
	    @Modifying
	    @Transactional
	    @Query("DELETE FROM Application a " +
	           "WHERE a.recruitmentNews.RNID = :rnId " +
	           "AND a.applicant.applicantID = :applicantId")
	    void deleteApplicationByCompositeKey(
	        @Param("rnId") Integer recruitmentNewsId,
	        @Param("applicantId") Integer applicantId
	    );
	    
	    @Query("SELECT a FROM Applicant a LEFT JOIN FETCH a.application app WHERE app.recruitmentNews.RNID = :jobId")
	    List<Applicant> findApplicantsWithCVByJobId(@Param("jobId") Integer jobId);

	   
	    @Query("SELECT a FROM Application a " +
	    	       "JOIN FETCH a.recruitmentNews rn " +
	    	       "WHERE a.applicant.applicantID = :applicantId")
	    	List<Application> findApplicationsWithRecruitmentNews(@Param("applicantId") Integer applicantId);
	    
	    @Query("SELECT COUNT(a) FROM Application a WHERE a.recruitmentNews.RNID = :jobId AND a.status != 'REJECTED'")
	    Long countApplicantsByJobId(@Param("jobId") Integer jobId);
}
