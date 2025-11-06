package vn.iotstar.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;

import vn.iotstar.dto.applicant.EmployerCardDTO;
import vn.iotstar.entity.Employer;

public interface IEmployerService {

	EmployerCardDTO mapToDetail(Employer emp);

	Optional<Employer> findById(Integer id);

	List<Employer> findAll();

}
