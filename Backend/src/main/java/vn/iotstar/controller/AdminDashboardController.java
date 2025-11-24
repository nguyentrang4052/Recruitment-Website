package vn.iotstar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.iotstar.dto.AdminDashboardDTO;
import vn.iotstar.dto.RecruitmentNewsStatsDTO;
import vn.iotstar.dto.UserStatsDTO;
import vn.iotstar.service.IAdminDashboardService;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasAuthority('ROLE_admin')")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminDashboardController {

    @Autowired
    private IAdminDashboardService adminDashboardService;

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardDTO> getDashboardStats() {
        try {
            AdminDashboardDTO stats = adminDashboardService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user-stats")
    public ResponseEntity<UserStatsDTO> getUserStats() {
        try {
            UserStatsDTO userStats = adminDashboardService.getUserStats();
            return ResponseEntity.ok(userStats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/recruitment-stats")
    public ResponseEntity<RecruitmentNewsStatsDTO> getRecruitmentNewsStats() {
        try {
            RecruitmentNewsStatsDTO newsStats = adminDashboardService.getRecruitmentNewsStats();
            return ResponseEntity.ok(newsStats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}