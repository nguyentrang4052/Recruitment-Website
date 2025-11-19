package vn.iotstar.controller;

import java.util.List;
import org.springframework.http.MediaType;   // <- thêm nếu sau này dùng
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import vn.iotstar.dto.ProfileViewStatsDTO;
import vn.iotstar.security.CustomUserDetail;
import vn.iotstar.service.IViewLogService;

@RestController
@RequestMapping("/api/employer")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_employer')")
public class ViewLogController {

    private final IViewLogService viewLogService;

    @GetMapping("/views/stats")
    public ResponseEntity<List<ProfileViewStatsDTO>> getStats(
            @AuthenticationPrincipal CustomUserDetail user,
            @RequestParam(defaultValue = "7") int days) {

        if (days <= 0) days = 7;         
        List<ProfileViewStatsDTO> dto = viewLogService.getViewsLast7Days(user.getAccount().getAccountID());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON) 
                .body(dto);
    }
}