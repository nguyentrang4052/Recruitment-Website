package vn.iotstar.controller.applicant;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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
import vn.iotstar.entity.Application;
import vn.iotstar.enums.EStatus;
import vn.iotstar.service.IApplicationService;
import vn.iotstar.service.IRecruitmentService;

@RestController
@RequestMapping("/api/applicant")
public class RecruitmentController {

	@Autowired
	private IApplicationService aService;

	@Autowired
	private IRecruitmentService rService;

	@PostMapping("/apply")
	public ResponseEntity<?> apply(@RequestPart("CV") MultipartFile cvFile, @ModelAttribute ApplyRequestDTO dto,
			Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Unauthorized");
		}

		String username = authentication.getName();
		Application application = aService.apply(cvFile, dto, username);

		return ResponseEntity.ok(Map.of("message", "Nộp hồ sơ thành công"));
	}

	@GetMapping("/relate-jobs")
	public List<RecruitmentCardDTO> getRelateJob(@RequestParam Integer id) {

		return rService.getRelateJob(id).stream().filter(rn -> rn.getStatus() == EStatus.APPROVED)
				.map(rService::mapToDetail).toList();
	}
	
	

}
