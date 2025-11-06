package vn.iotstar.entity;

import java.io.Serializable;
import java.util.ArrayList;
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
	private Integer employerID;

	@Column(name = "employerName", nullable = false, length = 255)
	private String employerName;

	@Column(name = "representative", nullable = false, length = 255)
	private String representative;

	@Column(name = "phone", nullable = true, length = 11)
	private String phone;

	@Column(name = "companyWebsite", nullable = true, length = 255)
	private String companyWebsite;

	@Column(name = "companyProfile", nullable = true, length = 255)
	private String companyProfile;

	@Column(name = "address", nullable = true, length = 255)
	private String address;

	@Column(name = "companySize", nullable = true)
	private Integer companySize;

	@Column(name = "taxCode", nullable = true, length = 255)
	private String taxCode;

	@Column(name = "companyLogo", nullable = true, length = 255)
	private String companyLogo;

	@OneToMany(mappedBy = "employer")
	private List<RecruitmentNews> recruitmentNews;

	@OneToMany(mappedBy = "employer")
	private List<Rating> ratings = new ArrayList<>();

	@OneToMany(mappedBy = "employer")
	@JsonManagedReference
	private List<Transaction> transaction = new ArrayList<>();

	@OneToOne
	@JoinColumn(name = "accountID", referencedColumnName = "accountID")
	private Account account;

	@OneToMany(mappedBy = "employer")
	@JsonManagedReference
	private List<ViewLog> viewLog = new ArrayList<>();
	

}
