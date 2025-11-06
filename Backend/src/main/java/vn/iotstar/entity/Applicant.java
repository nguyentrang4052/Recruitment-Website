package vn.iotstar.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Applicant")
public class Applicant implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "applicantID")
	private Integer applicantID;

	@Column(name = "applicantName", nullable = false, length = 255)
	private String applicantName;

	@Column(name = "birthday", nullable = true)
	private LocalDate birthday;

	@Column(name = "gender", nullable = true)
	private Integer gender;

	@Column(name = "address", nullable = true, length = 255)
	private String address;

	@Column(name = "phone", nullable = true, length = 11)
	private String phone;

	@Column(name = "goal", nullable = true, length = 255)
	private String goal;

	@Column(name = "experience", nullable = true, length = 255)
	private String experience;

	@Column(name = "literacy", nullable = true, length = 255)
	private String literacy;

	@OneToOne(mappedBy = "applicant")
	@JsonManagedReference
	private CareerInformation careerInformation;

	@OneToMany(mappedBy = "applicant")
	@JsonManagedReference
	private List<Rating> rating = new ArrayList<>();

	@OneToMany(mappedBy = "applicant")
	@JsonManagedReference
	private List<Application> application;

	@OneToOne
	@JoinColumn(name = "accountID")
	private Account account;

	@ManyToMany
	@JoinTable(name = "ApplicantSkill", joinColumns = @JoinColumn(name = "applicantID"), inverseJoinColumns = @JoinColumn(name = "skillID"))
	private List<Skill> skill;


}
