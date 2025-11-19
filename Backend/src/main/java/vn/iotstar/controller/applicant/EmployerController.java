package vn.iotstar.controller.applicant;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.iotstar.dto.applicant.EmployerCardDTO;
import vn.iotstar.dto.applicant.RatingDTO;
import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.entity.Employer;
import vn.iotstar.entity.Rating;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.service.IEmployerService;
import vn.iotstar.service.IRatingService;
import vn.iotstar.service.IRecruitmentService;
import vn.iotstar.service.imp.EmailService;

@RestController
@RequestMapping("/api/applicant")
public class EmployerController {

	private final EmailService emailService;

	@Autowired
	private IEmployerService employerService;

	@Autowired
	private IRecruitmentService reService;
	
	@Autowired
	private IRatingService ratingService;

	EmployerController(EmailService emailService) {
		this.emailService = emailService;
	}

	@GetMapping("/companies")
	public List<EmployerCardDTO> getAllCompany() {
		return employerService.findAll().stream()
				.sorted(Comparator.<Employer, BigDecimal>comparing(e -> employerService.avgScore(e.getEmployerID()),
						Comparator.reverseOrder()))
				.map(employerService::mapToDetail).toList();
	}

	@GetMapping("/companies/detail")
	public EmployerCardDTO getEmployerDetail(@RequestParam Integer id) {
		Employer emp = employerService.findById(id).get();
		return employerService.mapToDetail(emp);
	}

	@GetMapping("/companies/job")
	public List<RecruitmentCardDTO> getRecruitment(@RequestParam Integer id) {
		return reService.findByEmployer_EmployerID(id).stream().map(reService::mapToDetail).toList();

	}
	
	@PostMapping("/companies/review")
	public ResponseEntity<RatingDTO> createReview(@RequestBody RatingDTO dto, @RequestParam Integer applicantId) {
        RatingDTO saved = ratingService.create(dto, applicantId);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
	
	@DeleteMapping("/companies/review/delete")
	public ResponseEntity<?> deleteReview(@RequestParam Integer applicantID, @RequestParam Integer employerID) {
       ratingService.deleteByEmployer_EmployerIDAndApplicant_ApplicantID(employerID, applicantID);
        return ResponseEntity.ok("Xoá đánh giá thành công");
    }
}
