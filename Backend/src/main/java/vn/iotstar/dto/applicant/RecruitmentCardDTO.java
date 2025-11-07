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
	


	

}
