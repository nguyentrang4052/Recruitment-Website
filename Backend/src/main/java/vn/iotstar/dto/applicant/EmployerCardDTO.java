package vn.iotstar.dto.applicant;

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

//	public String getName() {
//		return name;
//	}
//
//	public void setName(String name) {
//		this.name = name;
//	}
//
//	public String getLogo() {
//		return logo;
//	}
//
//	public void setLogo(String logo) {
//		this.logo = logo;
//	}
//
//	public Integer getEmployerId() {
//		return employerId;
//	}
//
//	public void setEmployerId(Integer employerId) {
//		this.employerId = employerId;
//	}
//
//	public String getProfile() {
//		return profile;
//	}
//
//	public void setProfile(String profile) {
//		this.profile = profile;
//	}
//
//	public Integer getCompanySize() {
//		return companySize;
//	}
//
//	public void setCompanySize(Integer companySize) {
//		this.companySize = companySize;
//	}
//
//	public String getFullName() {
//		return fullName;
//	}
//
//	public void setFullName(String fullName) {
//		this.fullName = fullName;
//	}
//
//	public List<RatingDTO> getRating() {
//		return rating;
//	}
//
//	public void setRating(List<RatingDTO> rating) {
//		this.rating = rating;
//	}
//
//	public Integer getJobs() {
//		return jobs;
//	}
//
//	public void setJobs(Integer jobs) {
//		this.jobs = jobs;
//	}
//
//	public Integer getReviews() {
//		return reviews;
//	}
//
//	public void setReviews(Integer reviews) {
//		this.reviews = reviews;
//	}
//
	public EmployerCardDTO(String name, String logo) {
		this.name = name;
		this.logo = logo;
	}

//	public EmployerCardDTO(String name, String logo, Integer employerId, String profile, Integer companySize,
//			String fullName, String image, Integer jobs, Integer reviews, List<RatingDTO> rating) {
//		this.name = name;
//		this.logo = logo;
//		this.employerId = employerId;
//		this.profile = profile;
//		this.companySize = companySize;
//		this.fullName = fullName;
//		this.image = image;
//		this.jobs = jobs;
//		this.reviews = reviews;
//		this.rating = rating;
//	}

}
