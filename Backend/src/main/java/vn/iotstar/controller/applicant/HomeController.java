package vn.iotstar.controller.applicant;

import java.math.BigDecimal;
import java.time.LocalDate;
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
import vn.iotstar.entity.ViewLog;
import vn.iotstar.enums.EStatus;
import vn.iotstar.repository.IViewLogRepository;
import vn.iotstar.service.IRecruitmentService;
import vn.iotstar.service.ISkillService;

@RestController
@RequestMapping("/api")
public class HomeController {

	@Autowired
	private IRecruitmentService rService;

	@Autowired
	private ISkillService skillService;
	
	@Autowired
	private IViewLogRepository viewRepository;
	
	@GetMapping("/")
	@ResponseBody
	public List<RecruitmentCardDTO> getAllRecruitments() {
		return rService.findAllNews().stream().map(rService::mapToDetail).toList();
	}

	@GetMapping("/detail")
	public RecruitmentCardDTO getRecruitmentDetail(@RequestParam Integer id) {
		RecruitmentNews reNews = rService.findById(id).get();
		ViewLog view = new ViewLog();
		view.setReNews(reNews);
		viewRepository.save(view);
		return rService.mapToDetail(reNews);

	}

	@GetMapping("/job/search")
	public List<RecruitmentCardDTO> getJobsByCriteria(@RequestParam(required = false) String skillName,
			@RequestParam(required = false) String position, @RequestParam(required = false) String level,
			@RequestParam(required = false) String location, @RequestParam(required = false) BigDecimal minSalary,
			@RequestParam(required = false) BigDecimal maxSalary) {

		if (skillName != null) {
			return rService.findBySkill_SkillName(skillName).stream().map(rService::mapToDetail).toList();
		} else if (position != null) {
			return rService.findByPosition(position).stream().map(rService::mapToDetail).toList();
		} else if (level != null) {
			return rService.findByLevel(level).stream().map(rService::mapToDetail).toList();
		} else if (location != null) {
			return rService.findByLocation(location).stream().map(rService::mapToDetail).toList();
		} else if (minSalary != null && maxSalary != null) {

			return rService.findBySalary(minSalary, maxSalary).stream().map(rService::mapToDetail).toList();
		}
		return rService.findAllNews().stream().map(rService::mapToDetail).toList();
	}

}
