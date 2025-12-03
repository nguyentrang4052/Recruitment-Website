package vn.iotstar.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;
import vn.iotstar.key.RatingID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Rating")
@IdClass(RatingID.class)
public class Rating implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@ManyToOne
	@JoinColumn(name = "applicantID")
	private Applicant applicant;

	@Id
	@ManyToOne
	@JoinColumn(name = "employerID")
	private Employer employer;

	@Column(name = "score", nullable = true, precision = 10, scale = 2)
	private BigDecimal score;

	@Column(name = "content", nullable = true, length = 1000)
	private String content;

	@Column(name = "date", nullable = true)
	private LocalDateTime date = LocalDateTime.now();
}
