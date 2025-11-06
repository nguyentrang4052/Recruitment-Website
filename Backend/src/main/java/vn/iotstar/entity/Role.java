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
@Table(name = "Role")
public class Role implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer roleID;
	
	@Column (name = "roleName", nullable = true, length = 255)
	private String roleName;
	

	@OneToMany(mappedBy = "role",fetch = FetchType.EAGER)
	@JsonManagedReference
	private List<Account> account;

	


}
