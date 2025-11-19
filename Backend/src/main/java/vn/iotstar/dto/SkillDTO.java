package vn.iotstar.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillDTO {
    private Integer skillID;
    private String skillName;
    
    
	public SkillDTO(Integer skillID, String skillName) {
		this.skillID = skillID;
		this.skillName = skillName;
	}
    
    private String description;


	public SkillDTO(String skillName, String description) {
		this.skillName = skillName;
		this.description = description;
	}
    
    
}