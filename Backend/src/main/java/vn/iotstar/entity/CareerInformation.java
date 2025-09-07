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
	private int ID;

	@Column(name = "desireLevel", columnDefinition = "nvarchar(255) NULL")
	private String desireLevel;

	@Column(name = "desireSalary", columnDefinition = "decimal(10,2) NULL")
	private BigDecimal desireSalary;

	@Enumerated(EnumType.STRING)
	private EFormOfWork formOfWork;

	@Column(name = "location", columnDefinition = "nvarchar(255) NULL")
	private String location;

	@OneToOne
	@JoinColumn(name = "applicantID")
	private Applicant applicant;

}
