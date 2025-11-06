package vn.iotstar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequestDTO {

	private String applicantName;
	private String username;
	private String password;
	private String email;
	private String confirmPassword;
	 
	
	public SignupRequestDTO(String applicantName, String username, String password, String email) {
		this.applicantName = applicantName;
		this.username = username;
		this.password = password;
		this.email = email;
	}
	
}
