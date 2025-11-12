package vn.iotstar.service;

import java.math.BigDecimal;

import jakarta.transaction.Transactional;
import vn.iotstar.dto.applicant.RatingDTO;
import vn.iotstar.entity.Rating;

public interface IRatingService {

	Integer countByEmployer_EmployerID(Integer employerID);

	BigDecimal avgScore(Integer employerID);

	RatingDTO create(RatingDTO dto, Integer applicantId);

}
