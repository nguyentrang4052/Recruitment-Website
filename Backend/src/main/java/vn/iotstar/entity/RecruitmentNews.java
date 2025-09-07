package vn.iotstar.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;
import vn.iotstar.enums.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "RecruitmentNews")
public class RecruitmentNews implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "RNID")
	private int RNID;

	@Column(name = "position", columnDefinition = "nvarchar(255) NULL")
	private String position;

	@Column(name = "description", columnDefinition = "nvarchar(255) NULL")
	private String description;

	@Column(name = "experience", columnDefinition = "nvarchar(255) NULL")
	private String experience;

	@Column(name = "literacy", columnDefinition = "nvarchar(255) NULL")
	private String literacy;

	@Column(name = "level", columnDefinition = "nvarchar(255) NULL")
	private String level;

	@Column(name = "minSalary", columnDefinition = "decimal(10,2) NULL")
	private BigDecimal minSalary;

	@Column(name = "maxSalary", columnDefinition = "decimal(10,2) NULL")
	private BigDecimal maxSalary;

	@Column(name = "benefit", columnDefinition = "nvarchar(255) NULL")
	private String benefit;

	@Column(name = "location", columnDefinition = "nvarchar(255) NULL")
	private String location;

	@Enumerated(EnumType.STRING)
	private EFormOfWork formOfWork;

	@Column(name = "workingTime", columnDefinition = "nvarchar(255) NULL")
	private String workingTime;

	@Column(name = "applyBy", columnDefinition = "nvarchar(255) NULL")
	private String applyBy;

	@Column(name = "postedAt", columnDefinition = "datetime NULL")
	private LocalDate postedAt;

	@Column(name = "deadline", columnDefinition = "datetime NULL")
	private LocalDate deadline;

	@Enumerated(EnumType.STRING)
	private EStatus status;

	@Column(name = "numbersOfViews", columnDefinition = "int NULL")
	private int numbersOfViews;

	@Column(name = "numbersOfRecords", columnDefinition = "int NULL")
	private int numbersOfRecords;

	@ManyToOne
	@JoinColumn(name = "employerID")
	private Employer employer;
	
	@OneToMany (mappedBy = "recruitmentNews", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<Require> requires;
	
	@OneToMany(mappedBy = "recruitmentNews", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<Application> application;
	

}
