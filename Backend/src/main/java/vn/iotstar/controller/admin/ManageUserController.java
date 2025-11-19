package vn.iotstar.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.iotstar.dto.ApplicantDTO;
import vn.iotstar.dto.applicant.ProfileDTO;
import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.entity.Applicant;
import vn.iotstar.service.IApplicantService;

@RestController
@RequestMapping("/api/admin")
public class ManageUserController {
	
	@Autowired
	private IApplicantService applicantService;
	
	@GetMapping("/applicant")
	public List<ProfileDTO> getAllApplicant() {
		return applicantService.findAll().stream().map(applicantService::mapToDetail).toList();
	}
	
	@GetMapping("/applicant/detail")
	public ProfileDTO getApplicantDetail(@RequestParam Integer id) {
		Applicant applicant = applicantService.findById(id).get();
		return applicantService.mapToDetail(applicant);
	}
	
	@PostMapping("/applicant/delete")
	public ResponseEntity<?> deleteApplicant(@RequestParam Integer id)
	{
		applicantService.deleteApplicant(id);
		return ResponseEntity.ok("Khoá tài khoản ứng viên thành công");
	}
	
//	@GetMapping("/employer")
//	public List<>
	

}
