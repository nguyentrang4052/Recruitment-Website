package vn.iotstar.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import vn.iotstar.security.CustomUserDetail;
import vn.iotstar.service.IEmployerSettingService;

@RestController
@RequestMapping("/api/employer/settings")
@PreAuthorize("hasAuthority('ROLE_employer')")
@RequiredArgsConstructor
public class EmployerSettingController {

    private final IEmployerSettingService service;

    @GetMapping("/info")
    public ResponseEntity<Map<String, String>> getInfo(@AuthenticationPrincipal CustomUserDetail user) {
        String email = service.getCurrentEmail(user.getAccount().getAccountID());
        return ResponseEntity.ok(Map.of("email", email));
    }

    @PatchMapping(value = "/password", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> updatePassword(
            @AuthenticationPrincipal CustomUserDetail user,
            @org.springframework.web.bind.annotation.RequestBody Map<String, String> req) {
        service.updatePassword(user.getAccount().getAccountID(), req.get("newPassword"));
        return ResponseEntity.ok(Map.of("success", true, "message", "Mật khẩu đã được cập nhật"));
    }

    @PatchMapping(value = "/email", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> updateEmail(
            @AuthenticationPrincipal CustomUserDetail user,
            @org.springframework.web.bind.annotation.RequestBody Map<String, String> req) {
        service.updateEmail(user.getAccount().getAccountID(), req.get("newEmail"));
        return ResponseEntity.ok(Map.of("success", true, "message", "Email đã được cập nhật"));
    }
}