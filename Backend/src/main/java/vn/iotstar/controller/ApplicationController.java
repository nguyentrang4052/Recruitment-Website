package vn.iotstar.controller;

import vn.iotstar.dto.NewApplicantResponseDTO;
import vn.iotstar.service.IApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employer/applications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@PreAuthorize("hasAuthority('ROLE_employer')")
public class ApplicationController {

    @Autowired
    private IApplicationService applicationService;

    @GetMapping("/new")
    public ResponseEntity<List<NewApplicantResponseDTO>> getNewApplicants(
            @RequestParam Integer recruitmentNewsId) {
        return ResponseEntity.ok(
            applicationService.getNewApplicantsByRecruitmentNewsId(recruitmentNewsId)
        );
    }

    @PutMapping("/{rnId}/{applicantId}/approve")
    public ResponseEntity<Map<String, Boolean>> approveApplicant(
            @PathVariable Integer rnId,
            @PathVariable Integer applicantId) {
        applicationService.approveApplicant(rnId, applicantId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PutMapping("/{rnId}/{applicantId}/reject")
    public ResponseEntity<Map<String, Boolean>> rejectApplicant(
            @PathVariable Integer rnId,
            @PathVariable Integer applicantId) {
        applicationService.rejectApplicant(rnId, applicantId);
        return ResponseEntity.ok(Map.of("success", true));
    }
}