package vn.iotstar.entity;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;
import vn.iotstar.key.ApplicantSkillID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ApplicantSkill")
@IdClass(ApplicantSkillID.class)
public class ApplicantSkill implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@ManyToOne
	@JsonManagedReference
	@JoinColumn(name = "skillID")
	private Skill skill;
	
	@Id
	@ManyToOne
	@JsonManagedReference
	@JoinColumn(name= "applicantID")
	private Applicant applicant;

}
