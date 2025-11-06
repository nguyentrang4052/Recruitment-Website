package vn.iotstar.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
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
	private Integer RNID;

	@Column(name = "position", nullable = false, length = 255)
	private String position;

	@Column(name = "description", nullable = false, length = 3000)
	private String description;

	@Column(name = "experience", nullable = true, length = 255)
	private String experience;

	@Column(name = "literacy", nullable = true, length = 255)
	private String literacy;

	@Column(name = "level", nullable = true, length = 255)
	private String level;

	@Column(name = "other", nullable = true, length = 2500)
	private String other;


	@Column(name = "minSalary", nullable = true, precision = 10, scale = 2)
	private BigDecimal minSalary;

	@Column(name = "maxSalary", nullable = true, precision = 10, scale = 2)
	private BigDecimal maxSalary;

	@Column(name = "benefit", nullable = true, length = 255)
	private String benefit;

	@Column(name = "location", nullable = true, length = 255)
	private String location;

	@Enumerated(EnumType.STRING)
	private EFormOfWork formOfWork;

	@Column(name = "workingTime", nullable = true, length = 255)
	private String workingTime;

	@Column(name = "applyBy", nullable = false, length = 255)
	private String applyBy;

	@Column(name = "postedAt")
	private LocalDate postedAt = LocalDate.now();

	@Column(name = "deadline", nullable = false)
	private LocalDate deadline;

	@Enumerated(EnumType.STRING)
	private EStatus status;

	@Column(name = "numbersOfViews", nullable = true)
	private Integer numbersOfViews;

	@Column(name = "numbersOfRecords", nullable = true)
	private Integer numbersOfRecords;

	@ManyToOne
	@JoinColumn(name = "employerID")
	private Employer employer;


	@OneToMany(mappedBy = "recruitmentNews")
	@JsonManagedReference
	private List<Application> application;
	
	@OneToMany(mappedBy = "reNews")
	@JsonManagedReference
	private List<ViewLog> viewLog;
	
	@ManyToMany
	@JoinTable(name = "Require", joinColumns = @JoinColumn(name = "RNID"), inverseJoinColumns = @JoinColumn(name = "skillID"))
	private List <Skill> skill;

}
