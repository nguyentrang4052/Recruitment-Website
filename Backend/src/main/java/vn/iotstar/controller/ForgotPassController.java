package vn.iotstar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import vn.iotstar.dto.ForgotPassRequestDTO;
import vn.iotstar.dto.ForgotPassResponeDTO;
import vn.iotstar.service.IAccountService;
import vn.iotstar.util.SecurityUtil;

@Controller
@RequestMapping("/api/auth")
public class ForgotPassController {

	private final SecurityUtil securityUtil;

	@Autowired
	private IAccountService accountService;

	ForgotPassController(SecurityUtil securityUtil) {
		this.securityUtil = securityUtil;
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<ForgotPassResponeDTO> registerUser(@RequestBody ForgotPassRequestDTO req) {

		boolean isSent = securityUtil.sendOtp(req.getEmail());
		if (isSent) {
			return ResponseEntity.ok(new ForgotPassResponeDTO("OTP đã được gửi đến email của bạn.", true));
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ForgotPassResponeDTO("Không thể gửi được OTP.", false));
		}
	}

	@PostMapping("/verify-otp")
	public ResponseEntity<ForgotPassResponeDTO> verifyOtp(@RequestBody ForgotPassRequestDTO req) {
		boolean isOtpValid = securityUtil.verifyOtp(req.getEmail(), req.getOtp());

		if (isOtpValid) {
			return ResponseEntity.ok(new ForgotPassResponeDTO("OTP hợp lệ. Bạn có thể thay đổi mật khẩu.", true));
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ForgotPassResponeDTO("Mã OTP không hợp lệ. Vui lòng thử lại.", false));
		}
	}

	@PostMapping("/reset-password")
	public ResponseEntity<ForgotPassResponeDTO> verifyEmail(@RequestBody ForgotPassRequestDTO req) {
		try {
			ForgotPassResponeDTO res = accountService.updatPass(req);
			return ResponseEntity.ok(res);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ForgotPassResponeDTO(e.getMessage(), false));
		}
	}

}
