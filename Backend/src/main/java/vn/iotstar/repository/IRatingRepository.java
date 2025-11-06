package vn.iotstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.iotstar.entity.Rating;
import vn.iotstar.key.RatingID;

@Repository
public interface IRatingRepository extends JpaRepository<Rating, RatingID> {
	
	Integer countByEmployer_EmployerID(Integer employerID);

}
