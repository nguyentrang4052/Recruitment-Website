package vn.iotstar.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
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
	private int applicantID;

	@Column(name = "name", columnDefinition = "nvarchar(255) NULL")
	private String name;

	@Column(name = "birthday", columnDefinition = "datetime NULL")
	private LocalDateTime birthday;

	@Column(name = "gender", columnDefinition = "int NULL")
	private int gender;

	@Column(name = "address", columnDefinition = "nvarchar(255) NULL")
	private String address;

	@Column(name = "phone", columnDefinition = "varchar(20) NULL")
	private String phone;

	@Column(name = "email", columnDefinition = "varchar(255) NOT NULL")
	private String email;

	@Column(name = "goal", columnDefinition = "nvarchar(255) NULL")
	private String goal;

	@Column(name = "experience", columnDefinition = "nvarchar(255) NULL")
	private String experience;

	@Column(name = "literacy", columnDefinition = "nvarchar(255) NULL")
	private String literacy;

	@Column(name = "CV", columnDefinition = "varchar(255) NOT NULL")
	private String CV;

	@OneToOne(mappedBy = "applicant", cascade = CascadeType.ALL)
	private CareerInformation careerInformation;

	@OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<Rating> rating;

	@OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<ApplicantSkill> applicantSkill;

	@OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<Application> application;
}
