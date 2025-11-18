package vn.iotstar.entity;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="ViewLog")
public class ViewLog implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "viewLogID")
	private Integer viewLogID;
	
	@Column(name = "viewDate")
	private LocalDate viewDate = LocalDate.now();
	
	@ManyToOne
	@JoinColumn(name = "applicantID", referencedColumnName = "applicantID")
	private Applicant applicant;
	
	@ManyToOne
	@JoinColumn(name="RNID", referencedColumnName = "RNID")
	private RecruitmentNews reNews;
	
	
}
