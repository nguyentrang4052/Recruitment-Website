package vn.iotstar.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.iotstar.enums.EFrequency;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "JobNotice")
public class JobNotice {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer noticeID;

	@ManyToOne
	@JoinColumn(name = "applicantID", nullable = false)
	private Applicant applicant;

	@Column(name = "jobTitle")
	private String jobTitle;

	@Column(name = "location")
	private String location;

	@Column(name = "salary")
	private String salary;

	@Column(name = "level")
	private String level;

	@Enumerated(EnumType.STRING)
	@Column(name = "frequency")
	private EFrequency frequency;

	@Column(name = "createdDate")
	private LocalDateTime createdDate;

	@Column(name = "lastSentDate")
	private LocalDate lastSentDate;

	@Column(name = "isActive")
	private Boolean isActive = true;
}
