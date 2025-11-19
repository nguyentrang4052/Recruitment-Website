package vn.iotstar.dto.applicant.notice;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.iotstar.entity.RecruitmentNews;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobNoticeDTO {
	private Integer id;
	private String title;
	private String position;
	private String location;
	private String salary;
	private String level;
//	private BigDecimal maxSalary;
//	private List<RecruitmentNews> rn;
	private String frequency;
//	private Boolean emailEnabled;
//	private Boolean webEnabled;
	private String createdDate;
	private Integer matchingJobs;
	private String baseUrl; 

}
