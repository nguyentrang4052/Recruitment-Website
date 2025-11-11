package vn.iotstar.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


import vn.iotstar.dto.applicant.EmployerCardDTO;
import vn.iotstar.entity.Employer;

public interface IEmployerService {

	EmployerCardDTO mapToDetail(Employer emp);

	Optional<Employer> findById(Integer id);

	List<Employer> findAll();

    Employer findByAccount_accountID(Integer accountId);

    <S extends Employer> S save(S entity);

    long count();

	BigDecimal avgScore(Integer id);

}
