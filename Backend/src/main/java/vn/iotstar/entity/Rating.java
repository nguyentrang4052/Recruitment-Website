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

<<<<<<< HEAD
	@Column(name = "score", columnDefinition = "decimal(10,2) NULL")
=======
	@Column(name = "score", columnDefinition = "decimal(10, 2) NULL")
>>>>>>> 7e621e9811bfb9065b4925fbcdb545d2f5df34d5
	private BigDecimal score;

	@Column(name = "content", columnDefinition = "nvarchar(255) NULL")
	private String content;

	@Column(name = "date", columnDefinition = "datetime NULL")
	private LocalDate date = LocalDate.now();
}
