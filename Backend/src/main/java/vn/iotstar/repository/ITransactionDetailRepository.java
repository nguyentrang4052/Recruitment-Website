package vn.iotstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.iotstar.entity.TransactionDetail;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ITransactionDetailRepository extends JpaRepository<TransactionDetail, Integer> {
 
    Optional<TransactionDetail> findByTransaction_TransactionID(Integer transactionID);
    
    List<TransactionDetail> findByPostPackage_PackageID(Integer packageID);
    
    @Query("SELECT td FROM TransactionDetail td " +
 	       "JOIN td.transaction t " +
 	       "JOIN td.postPackage p " +
 	       "WHERE t.employer.employerID = :employerID " +
 	       "AND td.expiryDate >= :today")
 	List<TransactionDetail> findActiveByEmployer(
 	        @Param("employerID") Integer employerID,
 	        @Param("today") LocalDate today);
}