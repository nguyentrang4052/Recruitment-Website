package vn.iotstar.dto.applicant.notice;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.iotstar.enums.EFrequency;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateNoticeRequestDTO {

	private String jobTitle;
	private String location;
	private String salary;
	private String level;
	private String frequency;
//	private Boolean emailEnabled = true;
//	private Boolean webEnabled = true;

}
