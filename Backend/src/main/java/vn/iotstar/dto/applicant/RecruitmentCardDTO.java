package vn.iotstar.dto.applicant;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.*;
import vn.iotstar.entity.Application;
import vn.iotstar.enums.EFormOfWork;
import vn.iotstar.enums.EStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecruitmentCardDTO {
	private Integer rnid;
	private String position;
	private EmployerCardDTO employer;
	private String salary;
	private String location;
	private LocalDate deadline;
	private LocalDate postedAt;
	private List<String> skill = new ArrayList<>();
	private EStatus status;

	private String description;
	private String experience;
	private String literacy;
	private String level;
	private String other;
	private String benefit;
	private EFormOfWork formOfWork;
	private String workingTime;
	private String applyBy;
	public RecruitmentCardDTO(Integer rnid, String position, EmployerCardDTO employer, String salary, String location,
			LocalDate deadline, LocalDate postedAt, List<String> skill, EStatus status, String description,
			String experience, String literacy, String level, String other, String benefit, EFormOfWork formOfWork,
			String workingTime, String applyBy) {
		this.rnid = rnid;
		this.position = position;
		this.employer = employer;
		this.salary = salary;
		this.location = location;
		this.deadline = deadline;
		this.postedAt = postedAt;
		this.skill = skill;
		this.status = status;
		this.description = description;
		this.experience = experience;
		this.literacy = literacy;
		this.level = level;
		this.other = other;
		this.benefit = benefit;
		this.formOfWork = formOfWork;
		this.workingTime = workingTime;
		this.applyBy = applyBy;
	}
	
	
	
	private Application application;

}
