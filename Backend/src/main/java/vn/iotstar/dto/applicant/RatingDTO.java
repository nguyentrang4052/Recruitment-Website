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
	private Integer applicantID;
	private Integer employerID;
	
	
	public RatingDTO(String content, LocalDateTime date, BigDecimal score, Integer applicantID, Integer employerID) {
		this.content = content;
		this.date = date;
		this.score = score;
		this.applicantID = applicantID;
		this.employerID = employerID;
	}


	private String name;


	public RatingDTO(String content, LocalDateTime date, BigDecimal score, String name) {
		this.content = content;
		this.date = date;
		this.score = score;
		this.name = name;
	}
	
	
}
