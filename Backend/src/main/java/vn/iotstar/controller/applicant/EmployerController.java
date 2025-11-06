package vn.iotstar.controller.applicant;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.iotstar.dto.applicant.EmployerCardDTO;
import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.entity.Employer;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.service.IEmployerService;
import vn.iotstar.service.IRecruitmentService;

@RestController
@RequestMapping("/api/applicant")
public class EmployerController {
	
	@Autowired
	private IEmployerService employerService;
	
	@Autowired
	private IRecruitmentService reService;
	
	@GetMapping("/companies")
	public List<EmployerCardDTO> getAllCompany(){
		return employerService.findAll().stream().map(employerService::mapToDetail).toList();
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
}
