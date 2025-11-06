package vn.iotstar.entity;

import java.io.Serializable;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Account")
public class Account implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "accountID")
	private Integer accountID;

	@Column(name = "username", unique = true, nullable = true, length = 30)
	private String username;

	@Column(name = "password", nullable = true, length = 255)
	private String password;

	@Column(name = "email", unique = true, nullable = false, length = 255)
	private String email;
	
	@Column (name="provider", unique=false,nullable=true, length=255)
	private String provider;

	@Column(name = "createDate", nullable = true)
	private LocalDate createDate = LocalDate.now();

	@Column(name = "active", nullable = true)
	private Integer active;

	@Column(name = "photo", nullable = true, length = 255)
	private String photo;

	public String getPhoto() {
		return photo;
	}

	public void setPhoto(String photo) {
		this.photo = photo;
	}

	@ManyToOne
	@JoinColumn(name = "roleID", referencedColumnName = "roleID")
	private Role role;

	@OneToOne(mappedBy = "account", cascade = CascadeType.PERSIST)
	private Applicant applicant;
	
//	@JsonManagedReference

	@OneToOne(mappedBy = "account")
	@JsonManagedReference
	private Employer employer;
	
	

}