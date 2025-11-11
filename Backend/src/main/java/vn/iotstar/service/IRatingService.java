package vn.iotstar.service;

import java.math.BigDecimal;

public interface IRatingService {

	Integer countByEmployer_EmployerID(Integer employerID);

	BigDecimal avgScore(Integer employerID);

}
