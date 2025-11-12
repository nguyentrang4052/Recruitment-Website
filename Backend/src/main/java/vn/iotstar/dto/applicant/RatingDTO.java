package vn.iotstar.dto.applicant;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingDTO {

	private String content;
	private LocalDateTime date;
	private BigDecimal score;
	public RatingDTO(String content, LocalDateTime date, BigDecimal score) {
		this.content = content;
		this.date = date;
		this.score = score;
	}
	
//	private Integer applicantID;
	private Integer employerID;

}
