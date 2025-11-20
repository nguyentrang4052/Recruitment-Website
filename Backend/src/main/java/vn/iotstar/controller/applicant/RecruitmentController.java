package vn.iotstar.controller.applicant;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collector;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletResponse;
import vn.iotstar.dto.applicant.ApplyRequestDTO;
import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.Application;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.enums.EStatus;
import vn.iotstar.service.IAccountService;
import vn.iotstar.service.IApplicantService;
import vn.iotstar.service.IApplicationService;
import vn.iotstar.service.IFavouriteJobService;
import vn.iotstar.service.IRecruitmentService;
import vn.iotstar.service.imp.EmailService;

@RestController
@RequestMapping("/api/applicant")
public class RecruitmentController {

	@Autowired
	private IApplicationService aService;

	@Autowired
	private IRecruitmentService rService;

	@Autowired
	private IFavouriteJobService fService;
	
	@Autowired
	private IApplicantService applicantService;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private IAccountService accountService;

//	@PostMapping("/apply")
//	public ResponseEntity<?> apply(@RequestPart("CV") MultipartFile cvFile, @ModelAttribute ApplyRequestDTO dto,
//			Authentication authentication) {
//		if (authentication == null || !authentication.isAuthenticated()) {
//			return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Unauthorized");
//		}
//
//		String username = authentication.getName();
//		Application application = aService.apply(cvFile, dto, username);
//
//		return ResponseEntity.ok(Map.of("message", "Nộp hồ sơ thành công"));
//	}
	
	@PostMapping("/apply")
	public ResponseEntity<?> apply(@RequestPart("CV") MultipartFile cvFile, @ModelAttribute ApplyRequestDTO dto,
			Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Unauthorized");
		}

		String username = authentication.getName();
		Application application = aService.apply(cvFile, dto, username);
		
		RecruitmentNews rn = application.getRecruitmentNews();
		emailService.sendVerificationApply(username, rn);
		return ResponseEntity.ok(Map.of("message", "Nộp hồ sơ thành công"));
	}

	@GetMapping("/relate-jobs")
	public List<RecruitmentCardDTO> getRelateJob(@RequestParam Integer id) {

		return rService.getRelateJob(id).stream().filter(rn -> rn.getStatus() == EStatus.APPROVED)
				.map(rService::mapToDetail).toList();
	}

	@GetMapping("/applied-job")
	public List<RecruitmentCardDTO> getAppliedJob(@RequestParam Integer id) {
		Optional<Applicant> applicant = applicantService.findById(id);
		return rService.findByApplication_Applicant_ApplicantID(id).stream()
				.map(rn -> rService.mapToApplication(applicant.get(), rn)).toList();
	}

	@PostMapping("/toggle")
	public ResponseEntity<String> toggleFavorite(@RequestParam Integer applicantID, @RequestParam Integer rnid) {
		try {
			String message = fService.toggleFavorite(applicantID, rnid);
			return ResponseEntity.ok(message);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
		}
	}

	@GetMapping("/favourite-job")
	public List<RecruitmentCardDTO> getFavouriteJob(@RequestParam Integer id) {
		return fService.getFavorites(id).stream().map(rService::mapToDetail).toList();
	}

}
