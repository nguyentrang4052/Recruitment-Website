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

}
