package vn.iotstar.repository;

import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.iotstar.entity.ViewLog;

@Repository
public interface IViewLogRepository extends JpaRepository<ViewLog, Integer> {
    
    // Đếm số lượt xem hồ sơ của employer trong khoảng thời gian
//    @Query("SELECT COUNT(v) FROM ViewLog v WHERE v.employer.account.accountID = :employerAccountId AND v.viewDate >= :sinceDate")
//    Long countViewsByEmployerSince(
//        @Param("employerAccountId") Integer employerAccountId, 
//        @Param("sinceDate") LocalDate sinceDate);
    
    @Query("SELECT COUNT(v) FROM ViewLog v WHERE v.reNews.RNID = :rnid")
    Integer countView(@Param("rnid") Integer rnid);
}