package vn.iotstar.entity;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Employer")
public class Employer implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "employerID")
	private int employerID;

	@Column(name = "employerName", columnDefinition = "nvarchar(255) NULL")
	private String employerName;

	@Column(name = "representative", columnDefinition = "nvarchar(255) NULL")
	private String representative;

	@Column(name = "email", columnDefinition = "varchar(255) NOT NULL")
	private String email;

	@Column(name = "phone", columnDefinition = " varchar(20) NULL")
	private String phone;

	@Column(name = "companyWebsite", columnDefinition = "varchar(255) NULL")
	private String companyWebsite;

	@Column(name = "companyProfile", columnDefinition = "nvarchar(255) NULL")
	private String companyProfile;

	@Column(name = "address", columnDefinition = "nvarchar(255) NULL")
	private String address;

	@Column(name = "companySize", columnDefinition = "int NULL")
	private int companySize;

	@Column(name = "taxCode", columnDefinition = "varchar(255) NULL")
	private String taxCode;

	@Column(name = "companyLogo", columnDefinition = "varchar(255) NULL")
	private String companyLogo;
	
	@OneToMany(mappedBy = "employer", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<RecruitmentNews> recruitmentNews;
	
	@OneToMany(mappedBy = "employer", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<Rating> ratings;
	
}
