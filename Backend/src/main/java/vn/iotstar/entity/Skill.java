package vn.iotstar.entity;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Skill")
public class Skill implements Serializable {


	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "skillID")
	private Integer skillID;

	@Column(name = "skillName", nullable = false, length = 255)
	private String skillName;

	@Column(name = "description", nullable = true, length = 255)
	private String description;

	@ManyToMany (mappedBy = "skill")
	@JsonIgnore
	private List<Applicant> applicant;
	
	@ManyToMany(mappedBy = "skill")
	@JsonIgnore
	private List<RecruitmentNews> reNews;
	
}
