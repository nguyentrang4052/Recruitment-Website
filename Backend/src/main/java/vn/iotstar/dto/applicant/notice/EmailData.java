package vn.iotstar.dto.applicant.notice;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.iotstar.dto.applicant.RecruitmentCardDTO;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailData {
	
	private String applicantName;
    private String keyword;
    private Integer jobCount;
    private List<RecruitmentCardDTO> jobs;

}
