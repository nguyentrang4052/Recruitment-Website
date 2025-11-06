package vn.iotstar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployerRegisterDTO {
	private String username;
    private String companyName;
    private String contactPerson;
    private String email;
    private String password;
    private String confirmPassword;
    private String phoneNumber;
   

 
}
