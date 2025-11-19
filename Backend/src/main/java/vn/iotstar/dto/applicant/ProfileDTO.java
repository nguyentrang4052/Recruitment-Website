package vn.iotstar.dto.applicant;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.*;
import vn.iotstar.entity.Skill;
import vn.iotstar.enums.EDesireLevel;
import vn.iotstar.enums.EFormOfWork;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDTO {
	private Integer applicantID;
	private String photo;
	private String email;
	private String applicantName;
	private String phone;
	private String address;
	private LocalDate birthday;
	
	private String goal;
	private String experience;
	private String literacy;
	private List<Skill> skills;
	
	private String title;
	private String desireLevel;
	private BigDecimal desireSalary;
	private EFormOfWork formOfWork;
	private String location;
//	public ProfileDTO(Integer applicantID, String photo, String email, String applicantName, String phone,
//			String address, LocalDate birthday, String goal, String experience, String literacy, List<Skill> skills,
//			String title, String desireLevel, BigDecimal desireSalary, EFormOfWork formOfWork, String location) {
//		this.applicantID = applicantID;
//		this.photo = photo;
//		this.email = email;
//		this.applicantName = applicantName;
//		this.phone = phone;
//		this.address = address;
//		this.birthday = birthday;
//		this.goal = goal;
//		this.experience = experience;
//		this.literacy = literacy;
//		this.skills = skills;
//		this.title = title;
//		this.desireLevel = desireLevel;
//		this.desireSalary = desireSalary;
//		this.formOfWork = formOfWork;
//		this.location = location;
//	}
//	
	private String gender;
	private String active;

}
