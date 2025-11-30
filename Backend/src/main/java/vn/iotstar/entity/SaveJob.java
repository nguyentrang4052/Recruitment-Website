package vn.iotstar.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "SaveJob")
public class SaveJob {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "applicantID", nullable = false)
	private Applicant applicant;

	@ManyToOne
	@JoinColumn(name = "RNID", nullable = false)
	private RecruitmentNews recruitmentNews;

	private LocalDateTime createdAt = LocalDateTime.now();

}
