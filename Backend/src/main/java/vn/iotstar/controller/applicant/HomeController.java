package vn.iotstar.controller.applicant;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import vn.iotstar.dto.applicant.EmployerCardDTO;
import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.entity.Skill;
import vn.iotstar.enums.EStatus;
import vn.iotstar.service.IRecruitmentService;

@RestController
@RequestMapping("/api")
public class HomeController {

	@Autowired
	private IRecruitmentService rService;

	@GetMapping("/")
	@ResponseBody
	public List<RecruitmentCardDTO> getAllRecruitments() {
		return rService.findAll().stream().filter(rn -> rn.getStatus() == EStatus.APPROVED)
				.map(rService::mapToDetail).toList();
	}
	
	@GetMapping("/detail")
	public RecruitmentCardDTO getRecruitmentDetail(@RequestParam Integer id){
		RecruitmentNews reNews = rService.findById(id).get();		
		return rService.mapToDetail(reNews);
		
	}
}
