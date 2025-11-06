package vn.iotstar.dto.applicant;

import org.springframework.web.multipart.MultipartFile;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplyRequestDTO {
	private Integer applicantID;
	private Integer RNID;
	private String coverLetter;
	private MultipartFile CV;

}
