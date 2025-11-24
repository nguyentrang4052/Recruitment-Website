package vn.iotstar.controller.applicant;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import vn.iotstar.dto.ApplicantDTO;
import vn.iotstar.dto.ApplicantDetailDTO;
import vn.iotstar.dto.applicant.ProfileDTO;
import vn.iotstar.entity.Account;
import vn.iotstar.entity.Applicant;
import vn.iotstar.security.CustomUserDetail;
import vn.iotstar.service.IAccountService;
import vn.iotstar.service.IApplicantService;
import vn.iotstar.service.IEmployerSettingService;

@RestController
@RequestMapping("/api/applicant")
public class ManageInfoController {


	@Autowired
	private IApplicantService applicantService;

	@Autowired
	private IAccountService accountService;
	
	@Autowired
	 private IEmployerSettingService service;

	@GetMapping("/profile/info")
	public ProfileDTO getInfo(@RequestParam String email) {
		Applicant applicant = applicantService.findByAccount_email(email);
		
		return applicantService.mapToDetail(applicant);
	}

	@PostMapping("/profile/upload-photo/{email}")
	public ResponseEntity<Map<String, String>> uploadPhoto(@PathVariable String email,
			@RequestParam("photo") MultipartFile file) {

		Account acc = accountService.findByEmail(email);

		// Xóa ảnh cũ (nếu có và là file nội bộ)
		String oldPhoto = acc.getPhoto();
		if (oldPhoto != null && !oldPhoto.startsWith("http")) {
			applicantService.deleteFile(oldPhoto);
		}

		// Lưu ảnh mới
		String newPhoto = applicantService.storeFile(file);

		// Cập nhật DB
		acc.setPhoto(newPhoto);
		accountService.save(acc);
		Integer accId = acc.getAccountID();
		Applicant applicant = applicantService.findByAccount_accountID(accId);
		applicant.setAccount(acc);

		return ResponseEntity.ok(Map.of("photo", newPhoto));
	}

	@PutMapping("/profile/update/{applicantID}")
	public ResponseEntity<ProfileDTO> updateApplicant(@PathVariable Integer applicantID,
			@RequestBody ProfileDTO updatedApplicantDTO) {

		try {
			ProfileDTO result = applicantService.updateApplicant(applicantID, updatedApplicantDTO);

			return new ResponseEntity<>(result, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/delete/photo")
	public ResponseEntity<?> deletePhoto(@RequestParam String email) {
		Account acc = accountService.findByEmail(email);

		String oldPhoto = acc.getPhoto();
		if (oldPhoto == null || oldPhoto.isBlank()) {
			return ResponseEntity.badRequest().body("Không có ảnh để xóa");
		}

		if (oldPhoto != null && !oldPhoto.startsWith("http")) {
			applicantService.deleteFile(oldPhoto);
		}

		acc.setPhoto(null);
		accountService.save(acc);

		return ResponseEntity.ok("Xóa ảnh thành công");
	}
	
	    @GetMapping("/settings/info")
	    public ResponseEntity<Map<String, String>> getInfo(@AuthenticationPrincipal CustomUserDetail user) {
	        String email = service.getCurrentEmail(user.getAccount().getAccountID());
	        return ResponseEntity.ok(Map.of("email", email));
	    }

	    @PatchMapping(value = "/settings/password", consumes = MediaType.APPLICATION_JSON_VALUE)
	    public ResponseEntity<Map<String, Object>> updatePassword(
	            @AuthenticationPrincipal CustomUserDetail user,
	            @org.springframework.web.bind.annotation.RequestBody Map<String, String> req) {
	        service.updatePassword(user.getAccount().getAccountID(), req.get("newPassword"));
	        return ResponseEntity.ok(Map.of("success", true, "message", "Mật khẩu đã được cập nhật"));
	    }

	    @PatchMapping(value = "/settings/email", consumes = MediaType.APPLICATION_JSON_VALUE)
	    public ResponseEntity<Map<String, Object>> updateEmail(
	            @AuthenticationPrincipal CustomUserDetail user,
	            @org.springframework.web.bind.annotation.RequestBody Map<String, String> req) {
	        service.updateEmail(user.getAccount().getAccountID(), req.get("newEmail"));
	        return ResponseEntity.ok(Map.of("success", true, "message", "Email đã được cập nhật"));
	    }
}
