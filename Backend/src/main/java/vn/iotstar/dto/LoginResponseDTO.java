package vn.iotstar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {


    private String token;
    private String username;
    private String email;
    private String roleName;
    private Integer applicantID;
    private Integer employerID; 
    private String employerName;
  
}
