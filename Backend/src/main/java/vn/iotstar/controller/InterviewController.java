package vn.iotstar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import vn.iotstar.dto.InterviewMailRequestDTO;
import vn.iotstar.service.IInterviewService;

@RestController
@RequestMapping("/api/employer")
@PreAuthorize("hasAuthority('ROLE_employer')")
public class InterviewController {

    @Autowired
    private IInterviewService interviewService;

    @PostMapping("/send-interview-email")
    public ResponseEntity<?> sendInterviewEmail(@RequestBody InterviewMailRequestDTO request) {
        try {
            interviewService.approveAndScheduleInterview(request);
            return ResponseEntity.ok("✅ Đã gửi lịch phỏng vấn và cập nhật trạng thái duyệt.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Lỗi: " + e.getMessage());
        }
    }
}