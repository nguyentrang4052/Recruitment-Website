package vn.iotstar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import vn.iotstar.dto.OtpRequestDTO;
import vn.iotstar.dto.SignupRequestDTO;
import vn.iotstar.dto.SignupResponseDTO;
import vn.iotstar.service.IAccountService;

@Controller
@RequestMapping("/api/auth")
public class SignupController {

	@Autowired
	private IAccountService accountService;


	@PostMapping("/signup")
	public ResponseEntity<SignupResponseDTO> registerUser(@RequestBody SignupRequestDTO signupRequestDTO) {
		try {
			SignupResponseDTO response = accountService.registerUser(signupRequestDTO);

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new SignupResponseDTO(e.getMessage(), false));
		}
	}

	@PostMapping("/verify-email")
	public ResponseEntity<SignupResponseDTO> verifyEmail(@RequestBody OtpRequestDTO otpRequestDTO) {

		try {
			SignupResponseDTO res = accountService.verifyOtp(otpRequestDTO);
			return ResponseEntity.ok(res);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new SignupResponseDTO(e.getMessage(), false));
		}

	}

}
