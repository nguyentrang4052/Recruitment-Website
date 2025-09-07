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
@Table(name = "Skill")
public class Skill implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "skillID")
	private int skillID;

	@Column(name = "skillName", columnDefinition = "nvarchar(255) NOT NULL")
	private String skillName;

	@Column(name = "description", columnDefinition = "nvarchar(255) NULL")
	private String description;

	@OneToMany(mappedBy = "skill", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<Require> requires;

	@OneToMany(mappedBy = "skill", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<ApplicantSkill> applicantSkill;

}
