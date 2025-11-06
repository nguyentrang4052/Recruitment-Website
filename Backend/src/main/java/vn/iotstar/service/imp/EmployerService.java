package vn.iotstar.service.imp;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import vn.iotstar.dto.applicant.EmployerCardDTO;
import vn.iotstar.dto.applicant.RatingDTO;
import vn.iotstar.entity.Employer;
import vn.iotstar.repository.IEmployerRepository;
import vn.iotstar.repository.IRecruitmentRepository;
import vn.iotstar.service.IEmployerService;
import vn.iotstar.service.IRatingService;
import vn.iotstar.service.IRecruitmentService;

@Service
public class EmployerService implements IEmployerService {

	@Autowired
	private IEmployerRepository eRepository;

	@Autowired
	private IRecruitmentService reService;
	
	@Autowired
	private IRatingService ratingService;

	@Override
	public List<Employer> findAll() {
		return eRepository.findAll();
	}

	@Override
	public Optional<Employer> findById(Integer id) {
		return eRepository.findById(id);
	}

	public Integer countJobs(Integer id) {
		return reService.countApprovedJobs(id);
	}
	
	public Integer countReviews(Integer id) {
		return ratingService.countByEmployer_EmployerID(id);
	}

	@Override
	public EmployerCardDTO mapToDetail(Employer emp) {

		List<RatingDTO> rating = emp.getRatings().stream()
				.map(r -> new RatingDTO(r.getContent(), r.getDate(), r.getScore())).toList();

		return new EmployerCardDTO(
						emp.getEmployerName(),
						emp.getCompanyLogo(),
						emp.getEmployerID(),
						emp.getCompanyProfile(),
						emp.getCompanySize(),
						emp.getFullName(),
						emp.getCompanyImage(),
						countJobs(emp.getEmployerID()),
						countReviews(emp.getEmployerID()),
						rating);
	}
}
