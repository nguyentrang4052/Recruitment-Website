package vn.iotstar.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantDTO {
    
    private Integer applicantID;
    private String applicantName;
    private LocalDate birthday;
    private Integer gender; 
    private String address;
    private String phone;
    private String email; 
    private String photo; 
    
    private String goal; 
    private String experience; 
    private String literacy; 
    

    private String jobTitle; 
    private String desireLevel; 
    private String desireSalary; 
    private String formOfWork; 
    private String location; 
    
 
	private List<String> skillNames;
}