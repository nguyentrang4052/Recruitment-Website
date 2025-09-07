package vn.iotstar.entity;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;
import vn.iotstar.key.RequireID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Require")
@IdClass(RequireID.class)
public class Require implements Serializable{

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
	@JoinColumn(name= "RNID")
	private RecruitmentNews recruitmentNews;
	
}
