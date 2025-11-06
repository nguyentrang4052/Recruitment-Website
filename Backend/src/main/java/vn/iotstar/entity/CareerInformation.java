package vn.iotstar.entity;

import java.io.Serializable;
import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.*;
import vn.iotstar.enums.EFormOfWork;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "CareerInformation")
public class CareerInformation implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Integer ID;
	
	@Column(name = "title", nullable = true, length = 255)
	private String title;

	@Column(name = "desireLevel", nullable = true, length=255)
	private String desireLevel;

	@Column(name = "desireSalary", nullable = true, precision = 10, scale = 2)
	private BigDecimal desireSalary;

	@Enumerated(EnumType.STRING)
	private EFormOfWork formOfWork;

	@Column(name = "location", nullable = true, length = 255)
	private String location;

	@OneToOne
	@JoinColumn(name = "applicantID", referencedColumnName = "applicantID")
	private Applicant applicant;


}
