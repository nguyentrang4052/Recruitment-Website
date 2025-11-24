package vn.iotstar.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.enums.EStatus;
import java.util.Optional;

@Repository
@Transactional(readOnly = true)
public interface IRecruitmentNewsRepository extends JpaRepository<RecruitmentNews, Integer> {


    @Query("SELECT COUNT(rn) FROM RecruitmentNews rn " +
           "WHERE rn.employer.account.accountID = :employerAccountId " +
           "AND rn.status = :status")
    Long countActiveJobsByEmployer(
        @Param("employerAccountId") Integer employerAccountId,
        @Param("status") EStatus status);

   
    @Query("SELECT rn FROM RecruitmentNews rn " +
           "WHERE rn.employer.account.accountID = :accountId " +
           "AND rn.status = :status")
    Page<RecruitmentNews> findActiveJobsByEmployer(
        @Param("accountId") Integer accountId,
        @Param("status") EStatus status,
        Pageable pageable);

   
    @Query("SELECT COUNT(a) FROM Application a WHERE a.recruitmentNews.RNID = :jobId AND a.status != 'REJECTED'")
    Long countApplicantsByJobId(@Param("jobId") Integer jobId);
    
   
    @Query("SELECT rn FROM RecruitmentNews rn " +
           "LEFT JOIN FETCH rn.skill s " +
           "WHERE rn.RNID = :jobId")
    Optional<RecruitmentNews> findByIdWithSkills(@Param("jobId") Integer jobId);

   
    @Query("SELECT CASE WHEN COUNT(rn) > 0 THEN true ELSE false END " +
           "FROM RecruitmentNews rn " +
           "WHERE rn.RNID = :jobId " +
           "AND rn.employer.account.accountID = :employerAccountId")
    boolean existsByIdAndEmployer(@Param("jobId") Integer jobId, 
                                   @Param("employerAccountId") Integer employerAccountId);
    
    @Modifying
    @Query("UPDATE RecruitmentNews r SET  r.isActive = false WHERE r.RNID = :jobId AND r.employer.account.accountID = :employerAccountId")
    int deactivateJob(@Param("jobId") Integer jobId, @Param("employerAccountId") Integer employerAccountId);
    
    @Query("SELECT COUNT(r) FROM RecruitmentNews r")
    Long countTotalRecruitmentNews();
    
    @Query("SELECT COUNT(r) FROM RecruitmentNews r WHERE r.status = :status")
    Long countByStatus(EStatus status);
}