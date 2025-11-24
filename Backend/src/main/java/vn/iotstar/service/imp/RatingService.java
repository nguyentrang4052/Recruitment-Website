package vn.iotstar.service.imp;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import org.apache.catalina.mapper.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import vn.iotstar.dto.applicant.RatingDTO;
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.Employer;
import vn.iotstar.entity.Rating;
import vn.iotstar.key.RatingID;
import vn.iotstar.repository.IEmployerRepository;
import vn.iotstar.repository.IRatingRepository;
import vn.iotstar.service.IApplicantService;
import vn.iotstar.service.IEmployerService;
import vn.iotstar.service.IRatingService;

@Service
public class RatingService implements IRatingService {
	@Autowired
	private IRatingRepository ratingRepository;

	@Autowired
	private IApplicantService applicantService;

	@Autowired
	private IEmployerRepository empRepository;

	@Override
	public Integer countByEmployer_EmployerID(Integer employerID) {
		return ratingRepository.countByEmployer_EmployerID(employerID);
	}

	@Override
	public BigDecimal avgScore(Integer employerID) {
		BigDecimal avg = ratingRepository.avgScore(employerID);
		if (avg == null) {
			return BigDecimal.ZERO;
		}
		return avg.setScale(1, RoundingMode.HALF_UP);
	}

	@Override
	public RatingDTO maptoDetail(Rating rating) {
		return new RatingDTO(rating.getContent(), rating.getDate(), rating.getScore(),
				rating.getApplicant().getApplicantID(), rating.getEmployer().getEmployerID());
	}
	
	@Override
	public RatingDTO maptoRating(Rating rating) {
		return new RatingDTO(rating.getContent(), rating.getDate(), rating.getScore(),
				rating.getEmployer().getEmployerName());
	}

	@Override
	@Transactional
	public RatingDTO create(RatingDTO dto, Integer applicantId) {

		if (ratingRepository.existsByEmployer_EmployerIDAndApplicant_ApplicantID(dto.getEmployerID(), applicantId)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Bạn đã đánh giá công ty này rồi");
		}

		Rating rating = new Rating();
		rating.setScore(dto.getScore());
		rating.setContent(dto.getContent());
		rating.setDate(LocalDateTime.now());
		Applicant applicant = applicantService.findById(applicantId).get();
		rating.setApplicant(applicant);

		Employer employer = empRepository.findById(dto.getEmployerID()).get();
		rating.setEmployer(employer);
		ratingRepository.save(rating);

		return this.maptoDetail(rating);
	}

	@Override
	@Transactional
	public void deleteByEmployer_EmployerIDAndApplicant_ApplicantID(Integer employerID, Integer applicantID) {
		ratingRepository.deleteByEmployer_EmployerIDAndApplicant_ApplicantID(employerID, applicantID);
	}

	@Override
	public List<Rating> findLatestRatings() {
		return ratingRepository.findLatestRatings();
	}

}
