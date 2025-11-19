package vn.iotstar.repository;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.iotstar.entity.Rating;
import vn.iotstar.key.RatingID;

@Repository
public interface IRatingRepository extends JpaRepository<Rating, RatingID> {

	Integer countByEmployer_EmployerID(Integer employerID);

	@Query("SELECT AVG(r.score) FROM Rating r WHERE r.employer.employerID = :employerID")
	BigDecimal avgScore(@Param("employerID") Integer employerID);
	
	boolean existsByEmployer_EmployerIDAndApplicant_ApplicantID(Integer employerID, Integer applicantID);
	
	void deleteByEmployer_EmployerIDAndApplicant_ApplicantID(Integer employerID, Integer applicantID);
}
