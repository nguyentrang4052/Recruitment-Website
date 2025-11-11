package vn.iotstar.service.imp;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.iotstar.repository.IRatingRepository;
import vn.iotstar.service.IRatingService;

@Service
public class RatingService implements IRatingService {
	@Autowired
	private IRatingRepository ratingRepository;

	@Override
	public Integer countByEmployer_EmployerID(Integer employerID) {
		return ratingRepository.countByEmployer_EmployerID(employerID);
	}

	@Override
	public BigDecimal avgScore(Integer employerID) {
		BigDecimal avg =  ratingRepository.avgScore(employerID);
		 if (avg == null) {
		        return BigDecimal.ZERO;
		    }
		    return avg.setScale(1, RoundingMode.HALF_UP);
	}
	

}
