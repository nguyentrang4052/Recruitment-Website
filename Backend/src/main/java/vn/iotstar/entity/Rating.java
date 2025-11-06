package vn.iotstar.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
	@JsonManagedReference
	private Applicant applicant;

	@Id
	@ManyToOne
	@JoinColumn(name = "employerID")
	@JsonManagedReference
	private Employer employer;

	@Column(name = "score", nullable = true, precision = 10, scale = 2)
	private BigDecimal score;

	@Column(name = "content", nullable = true, length = 255)
	private String content;

	@Column(name = "date", nullable = true)
	private LocalDate date = LocalDate.now();
}
