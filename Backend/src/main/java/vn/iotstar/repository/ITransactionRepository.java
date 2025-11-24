package vn.iotstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.iotstar.dto.RevenueByPackageDTO;
import vn.iotstar.dto.RevenuePerMonthDTO;
import vn.iotstar.dto.RevenueSummaryDTO;
import vn.iotstar.entity.Transaction;
import vn.iotstar.entity.TransactionDetail;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ITransactionRepository extends JpaRepository<Transaction, Integer> {

	List<Transaction> findByEmployer_EmployerID(Integer employerID);
    
    
    List<Transaction> findByPaymentMethod(String paymentMethod);
    
  
    List<Transaction> findByCreateDate(LocalDate createDate);
    
 
    List<Transaction> findByEmployer_EmployerIDAndPaymentMethod(Integer employerID, String paymentMethod);
    
    @Query("SELECT t FROM Transaction t " +
            "JOIN TransactionDetail td ON td.transaction = t " +
            "WHERE t.employer.employerID = :employerId " +
            "  AND t.paymentMethod = 'FREE' " +
            "  AND td.expiryDate >= CURRENT_DATE ")
     List<Transaction> findActiveFreeByEmployer(@Param("employerId") Integer employerId);
    
    


    @Query("""
            SELECT NEW vn.iotstar.dto.RevenuePerMonthDTO(
                CONCAT('T', MONTH(t.createDate)),
                CAST(COALESCE(SUM(t.total), 0) AS Double),
                CAST(COUNT(t) AS Long))
            FROM Transaction t
            WHERE YEAR(t.createDate) = :year
            GROUP BY MONTH(t.createDate)
            ORDER BY MONTH(t.createDate)
            """)
     List<RevenuePerMonthDTO> getRevenuePerMonth(@Param("year") int year);

  
    @Query("""
            SELECT NEW vn.iotstar.dto.RevenueByPackageDTO(
                p.packageName,
                CAST(COALESCE(SUM(t.total), 0) AS Double),
                CAST(COUNT(t) AS Long),
                0.0,
                '')
            FROM Transaction t
            JOIN t.postPackage p
            WHERE YEAR(t.createDate) = :year
            GROUP BY p.packageName
            """)
     List<RevenueByPackageDTO> getRevenueByPackage(@Param("year") int year);


    @Query("""
            SELECT NEW vn.iotstar.dto.RevenueSummaryDTO(
                CAST(COALESCE(SUM(t.total), 0) AS Double),
                0.0,
                CAST(COUNT(t) AS Long),
                CAST(COALESCE(AVG(t.total), 0) AS Double))
            FROM Transaction t
            WHERE YEAR(t.createDate) = :year
            """)
     RevenueSummaryDTO getSummary(@Param("year") int year);
}