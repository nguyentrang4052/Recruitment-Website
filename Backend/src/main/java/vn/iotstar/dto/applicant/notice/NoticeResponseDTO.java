package vn.iotstar.dto.applicant.notice;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoticeResponseDTO {
	private String message;
	private JobNoticeDTO jobNoticeDTO;

}
