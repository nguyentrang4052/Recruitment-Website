package vn.iotstar.entity;

import java.io.Serializable;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;
import vn.iotstar.enums.EStatus;
import vn.iotstar.key.ApplicationID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Application")
@IdClass(ApplicationID.class)
public class Application implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@ManyToOne
	@JoinColumn(name = "RNID")
	@JsonBackReference  
	private RecruitmentNews recruitmentNews;

	@Id
	@ManyToOne
	@JsonBackReference  
	@JoinColumn(name = "applicantID")
	private Applicant applicant;

	@Column(name = "date", nullable = true)
	private LocalDate date = LocalDate.now();

	@Enumerated(EnumType.STRING)
	private EStatus status;

	@Column(name = "note", nullable = true, length = 255)
	private String note;
	
	@Column(name = "CV", nullable = true, length = 255)
	private String CV;


}
