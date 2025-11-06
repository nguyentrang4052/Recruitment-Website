package vn.iotstar.dto.applicant;

import org.springframework.web.multipart.MultipartFile;

import lombok.*;

@Data
public class ApplyRequestDTO {
	private Integer applicantID;
	private Integer RNID;
	private String coverLetter;
	private MultipartFile CV;

	public Integer getApplicantID() {
		return applicantID;
	}

	public void setApplicantID(Integer applicantID) {
		this.applicantID = applicantID;
	}

	public Integer getRNID() {
		return RNID;
	}

	public void setRNID(Integer rNID) {
		RNID = rNID;
	}

	public String getCoverLetter() {
		return coverLetter;
	}

	public void setCoverLetter(String coverLetter) {
		this.coverLetter = coverLetter;
	}

	public MultipartFile getCV() {
		return CV;
	}

	public void setCV(MultipartFile cV) {
		CV = cV;
	}

	public ApplyRequestDTO(Integer applicantID, Integer rNID, String coverLetter, MultipartFile cV) {
		this.applicantID = applicantID;
		RNID = rNID;
		this.coverLetter = coverLetter;
		CV = cV;
	}

}