package vn.iotstar.dto.applicant;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


import lombok.*;
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
	

//	public Integer getRnid() {
//		return rnid;
//	}
//
//	public void setRnid(Integer rnid) {
//		this.rnid = rnid;
//	}
//
//	public String getPosition() {
//		return position;
//	}
//
//	public void setPosition(String position) {
//		this.position = position;
//	}
//
//	public EmployerCardDTO getEmployer() {
//		return employer;
//	}
//
//	public void setEmployer(EmployerCardDTO employer) {
//		this.employer = employer;
//	}
//
//	public String getSalary() {
//		return salary;
//	}
//
//	public void setSalary(String salary) {
//		this.salary = salary;
//	}
//
//	public String getLocation() {
//		return location;
//	}
//
//	public void setLocation(String location) {
//		this.location = location;
//	}
//
//	public LocalDate getDeadline() {
//		return deadline;
//	}
//
//	public void setDeadline(LocalDate deadline) {
//		this.deadline = deadline;
//	}
//
//	public LocalDate getPostedAt() {
//		return postedAt;
//	}
//
//	public void setPostedAt(LocalDate postedAt) {
//		this.postedAt = postedAt;
//	}
//
//	public List<String> getSkill() {
//		return skill;
//	}
//
//	public void setSkill(List<String> skill) {
//		this.skill = skill;
//	}
//	
//	
//
//	public EStatus getStatus() {
//		return status;
//	}
//
//	public void setStatus(EStatus status) {
//		this.status = status;
//	}
//
//	public String getDescription() {
//		return description;
//	}
//
//	public void setDescription(String description) {
//		this.description = description;
//	}
//
//	public String getExperience() {
//		return experience;
//	}
//
//	public void setExperience(String experience) {
//		this.experience = experience;
//	}
//
//	public String getLiteracy() {
//		return literacy;
//	}
//
//	public void setLiteracy(String literacy) {
//		this.literacy = literacy;
//	}
//
//	public String getLevel() {
//		return level;
//	}
//
//	public void setLevel(String level) {
//		this.level = level;
//	}
//
//	public String getOther() {
//		return other;
//	}
//
//	public void setOther(String other) {
//		this.other = other;
//	}
//
//	public String getBenefit() {
//		return benefit;
//	}
//
//	public void setBenefit(String benefit) {
//		this.benefit = benefit;
//	}
//
//	public EFormOfWork getFormOfWork() {
//		return formOfWork;
//	}
//
//	public void setFormOfWork(EFormOfWork formOfWork) {
//		this.formOfWork = formOfWork;
//	}
//
//	public String getWorkingTime() {
//		return workingTime;
//	}
//
//	public void setWorkingTime(String workingTime) {
//		this.workingTime = workingTime;
//	}
//
//	public String getApplyBy() {
//		return applyBy;
//	}
//
//	public void setApplyBy(String applyBy) {
//		this.applyBy = applyBy;
//	}

//	public RecruitmentCardDTO(Integer rnid, String position, EmployerCardDTO employer, String salary, String location,
//			LocalDate deadline, LocalDate postedAt, List<String> skill) {
//		this.rnid = rnid;
//		this.position = position;
//		this.employer = employer;
//		this.salary = salary;
//		this.location = location;
//		this.deadline = deadline;
//		this.postedAt = postedAt;
//		this.skill = skill;
//	}

//	public RecruitmentCardDTO(Integer rnid, String position, EmployerCardDTO employer, String salary, String location,
//			LocalDate deadline, LocalDate postedAt, List<String> skill, EStatus status, String description, String experience,
//			String literacy, String level, String other, String benefit, EFormOfWork formOfWork, String workingTime,
//			String applyBy) {
//		this.rnid = rnid;
//		this.position = position;
//		this.employer = employer;
//		this.salary = salary;
//		this.location = location;
//		this.deadline = deadline;
//		this.postedAt = postedAt;
//		this.skill = skill;
//		this.status=status;
//		this.description = description;
//		this.experience = experience;
//		this.literacy = literacy;
//		this.level = level;
//		this.other = other;
//		this.benefit = benefit;
//		this.formOfWork = formOfWork;
//		this.workingTime = workingTime;
//		this.applyBy = applyBy;
//	}
//	
	

}
