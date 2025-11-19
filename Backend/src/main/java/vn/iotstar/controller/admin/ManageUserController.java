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
import vn.iotstar.dto.EmployerInfoDTO;
import vn.iotstar.dto.applicant.EmployerCardDTO;
import vn.iotstar.dto.applicant.ProfileDTO;
import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.Employer;
import vn.iotstar.service.IApplicantService;
import vn.iotstar.service.IEmployerService;

@RestController
@RequestMapping("/api/admin")
public class ManageUserController {

	@Autowired
	private IApplicantService applicantService;

	@Autowired
	private IEmployerService empService;

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
	public ResponseEntity<?> deleteApplicant(@RequestParam Integer id) {
		applicantService.deleteApplicant(id);
		return ResponseEntity.ok("Khoá tài khoản ứng viên thành công");
	}

	@GetMapping("/employer")
	public List<EmployerCardDTO> getAllEmployer() {
		return empService.findAll().stream().map(empService::mapToDetail).toList();
	}

	@GetMapping("/employer/detail")
	public EmployerCardDTO getEmployerDetail(@RequestParam Integer id) {
		Employer employer = empService.findById(id).get();
		return empService.mapToDetail(employer);
	}

	@PostMapping("/employer/delete")
	public ResponseEntity<?> deleteEmployer(@RequestParam Integer id) {
		empService.deleteEmployer(id);
		return ResponseEntity.ok("Khoá tài khoản nhà tuyển dụng thành công");
	}

}
