package vn.iotstar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicantDetailDTO {
    private Integer applicantID;
    private String applicantName;
    private String jobTitle;
    private String location;
    private String experience;
    private String desireSalary;
    private String photo; 
    private String email;
    private String phone;
    private String summary;
    private String literacy;
    

	private String level; 
    
  
    private List<String> skillNames; 

}