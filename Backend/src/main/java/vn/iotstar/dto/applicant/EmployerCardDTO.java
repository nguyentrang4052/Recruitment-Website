package vn.iotstar.dto.applicant;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerCardDTO {

	private String name;
	private String logo;

	private Integer employerId;
	private String profile;
	private Integer companySize;
	private String fullName;
	private String image;

	private Integer jobs;
	private Integer reviews;

	private List<RatingDTO> rating;
	private BigDecimal ranking;
	private String address;
	private String companyWebsite;

	public EmployerCardDTO(String name, String logo, Integer jobs, String address, String fullName) {
		this.name = name;
		this.logo = logo;
		this.jobs = jobs;
		this.address = address;
		this.fullName = fullName;
	}

}
