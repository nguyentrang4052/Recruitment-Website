package vn.iotstar.controller.applicant;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
import vn.iotstar.service.ISkillService;

@RestController
@RequestMapping("/api")
public class HomeController {

	@Autowired
	private IRecruitmentService rService;

	@Autowired
	private ISkillService skillService;

	@GetMapping("/")
	@ResponseBody
	public List<RecruitmentCardDTO> getAllRecruitments() {
		return rService.findAll().stream().filter(rn -> rn.getStatus() == EStatus.APPROVED).map(rService::mapToDetail)
				.toList();
	}

	@GetMapping("/detail")
	public RecruitmentCardDTO getRecruitmentDetail(@RequestParam Integer id) {
		RecruitmentNews reNews = rService.findById(id).get();
		return rService.mapToDetail(reNews);

	}

	@GetMapping("/job/search")
	public List<RecruitmentCardDTO> getJobsByCriteria(
	        @RequestParam(required = false) String skillName,
	        @RequestParam(required = false) String position,
	        @RequestParam(required = false) String level,
	        @RequestParam(required = false) String location) {

	    if (skillName != null) {
	        return rService.findBySkill_SkillName(skillName).stream().map(rService::mapToDetail).toList();
	    } else if (position != null) {
	        return rService.findByPosition(position).stream().map(rService::mapToDetail).toList();
	    } else if (level != null) {
	        return rService.findByLevel(level).stream().map(rService::mapToDetail).toList();
	    } else if (location != null) {
	        return rService.findByLocation(location).stream().map(rService::mapToDetail).toList();
	    }
	    return rService.findAll().stream().filter(rn -> rn.getStatus() == EStatus.APPROVED).map(rService::mapToDetail)
				.toList();
	}

	
}
