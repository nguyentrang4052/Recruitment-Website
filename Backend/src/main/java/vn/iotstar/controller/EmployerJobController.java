package vn.iotstar.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.iotstar.dto.ActiveJobDTO;
import vn.iotstar.dto.JobDetailDTO;
import vn.iotstar.security.CustomUserDetail;
import vn.iotstar.service.IEmployerJobService;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/employer/jobs")
@PreAuthorize("hasAuthority('ROLE_employer')")
@RequiredArgsConstructor
public class EmployerJobController {

    private final IEmployerJobService employerJobService;

    @GetMapping("/active")
    public ResponseEntity<Page<ActiveJobDTO>> getActiveJobs(
            @RequestParam(defaultValue = "1") int page,
            @AuthenticationPrincipal CustomUserDetail userDetails) {
        
        Integer employerAccountId = userDetails.getAccount().getAccountID();
        Page<ActiveJobDTO> jobs = employerJobService.getActiveJobs(employerAccountId, page, 6);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDetailDTO> getJobDetail(@PathVariable Integer id) {
        try {
            JobDetailDTO jobDetail = employerJobService.getJobDetail(id);
            return ResponseEntity.ok(jobDetail);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateJob(
            @PathVariable Integer id,
            @RequestBody JobDetailDTO updateDTO,
            @AuthenticationPrincipal CustomUserDetail userDetails) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            Integer employerAccountId = userDetails.getAccount().getAccountID();
            JobDetailDTO updated = employerJobService.updateJob(id, employerAccountId, updateDTO);
            
            response.put("success", true);
            response.put("message", "Cập nhật thành công");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteJob(
            @PathVariable Integer id,
            @AuthenticationPrincipal CustomUserDetail userDetails) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            Integer employerAccountId = userDetails.getAccount().getAccountID();
            employerJobService.deleteJob(id, employerAccountId);
            
            response.put("success", true);
            response.put("message", "Xóa thành công");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}