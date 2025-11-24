package vn.iotstar.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.iotstar.dto.RevenueResponseDTO;
import vn.iotstar.service.imp.RevenueService;

@RestController
@RequestMapping("/api/admin/revenue")
@PreAuthorize("hasAuthority('ROLE_admin')")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class RevenueController {

    private final RevenueService revenueService;

    @GetMapping
    public ResponseEntity<RevenueResponseDTO> getRevenue(
            @RequestParam(defaultValue = "2025") int year) {
        return ResponseEntity.ok(revenueService.getRevenue(year));
    }
}
