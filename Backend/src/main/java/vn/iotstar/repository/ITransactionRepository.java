package vn.iotstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import vn.iotstar.entity.Transaction;
import vn.iotstar.entity.TransactionDetail;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ITransactionRepository extends JpaRepository<Transaction, Integer> {

	List<Transaction> findByEmployer_EmployerID(Integer employerID);
    
    
    List<Transaction> findByPaymentMethod(String paymentMethod);
    
  
    List<Transaction> findByCreateDate(LocalDate createDate);
    
    // Tìm giao dịch của employer theo phương thức thanh toán 
    List<Transaction> findByEmployer_EmployerIDAndPaymentMethod(Integer employerID, String paymentMethod);
    
    @Query("SELECT t FROM Transaction t " +
            "JOIN TransactionDetail td ON td.transaction = t " +
            "WHERE t.employer.employerID = :employerId " +
            "  AND t.paymentMethod = 'FREE' " +
            "  AND td.expiryDate >= CURRENT_DATE ")
     List<Transaction> findActiveFreeByEmployer(@Param("employerId") Integer employerId);
}