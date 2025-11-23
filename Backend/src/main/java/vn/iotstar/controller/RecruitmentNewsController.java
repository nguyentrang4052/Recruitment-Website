package vn.iotstar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.iotstar.dto.RecruitmentNewsDTO;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.service.IRecruitmentNewsService;

import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/employer/recruitment")
@PreAuthorize("hasAuthority('ROLE_employer')")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RecruitmentNewsController {

    @Autowired
    private IRecruitmentNewsService recruitmentService;

    @GetMapping("/list")
    public ResponseEntity<List<RecruitmentNews>> getAllRecruitmentNews() {
        try {
            List<RecruitmentNews> list = recruitmentService.findAll();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecruitmentById(@PathVariable Integer id) {
        try {
            RecruitmentNews news = recruitmentService.findById(id)
                    .orElse(null);
            if (news == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy tin tuyển dụng"));
            }
            return ResponseEntity.ok(news);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi hệ thống"));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRecruitment(@RequestBody RecruitmentNewsDTO dto) {
        try {
            RecruitmentNews created = recruitmentService.save(dto);
            return ResponseEntity.ok(Map.of(
                "message", "Đăng tin tuyển dụng thành công!",
                "data", created
            ));
        } catch (RuntimeException e) {
    
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Lỗi hệ thống: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateRecruitment(@PathVariable Integer id, @RequestBody RecruitmentNewsDTO dto) {
        try {
            RecruitmentNews updated = recruitmentService.update(id, dto);
            return ResponseEntity.ok(Map.of(
                "message", "Cập nhật tin tuyển dụng thành công!",
                "data", updated
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Lỗi hệ thống: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRecruitment(@PathVariable Integer id) {
        try {
            recruitmentService.delete(id);
            return ResponseEntity.ok(Map.of(
                "message", "Xóa tin tuyển dụng thành công!"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Không thể xóa tin tuyển dụng"
            ));
        }
    }
}