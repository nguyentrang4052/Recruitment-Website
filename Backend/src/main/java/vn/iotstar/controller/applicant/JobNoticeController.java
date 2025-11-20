package vn.iotstar.controller.applicant;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.dto.applicant.notice.CreateNoticeRequestDTO;
import vn.iotstar.dto.applicant.notice.EmailData;
import vn.iotstar.dto.applicant.notice.JobNoticeDTO;
import vn.iotstar.dto.applicant.notice.NoticeResponseDTO;
import vn.iotstar.entity.JobNotice;
import vn.iotstar.service.IJobNoticeService;
import vn.iotstar.service.imp.EmailService;

@RestController
@RequestMapping("/api/applicant")
public class JobNoticeController {

	@Autowired
	private IJobNoticeService jService;
	
	@Autowired
	private EmailService emailService;
	
	@GetMapping("/notice")
	public List<JobNoticeDTO> getAllNotice(@RequestParam Integer id){
		return jService.findByApplicant_ApplicantIDAndIsActiveTrue(id).stream().map(jService::convertToDTO).toList();
	}

	@PostMapping("/notice/create")
	public ResponseEntity<NoticeResponseDTO> createNotification(@RequestBody CreateNoticeRequestDTO request,
			@RequestParam Integer applicantID) {

		JobNoticeDTO notification = jService.createNotification(applicantID, request);
		
		NoticeResponseDTO response = new NoticeResponseDTO("Tạo thành công", notification);

		return ResponseEntity.ok(response);

	}
	 @PutMapping("/notice/update/{id}")
	    public ResponseEntity<NoticeResponseDTO> updateNotification(
	            @PathVariable Integer id,
	            @RequestBody CreateNoticeRequestDTO request) {
	        
	        JobNoticeDTO notification = jService.updateNotice(id, request);
	        
	        return ResponseEntity.ok(new NoticeResponseDTO("Cập nhật thông báo thành công",notification));
	    }
	
	 @DeleteMapping("/notice/delete/{id}")
	 public ResponseEntity<?> deleteNotification(
	            @PathVariable Integer id)
	 {
		 jService.deleteNotice(id);
		 return ResponseEntity.ok("Xoá thông báo thành công");
	 }
	 
		
}
