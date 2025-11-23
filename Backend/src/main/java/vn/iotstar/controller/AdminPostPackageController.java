package vn.iotstar.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.iotstar.dto.PostPackageDTO;
import vn.iotstar.service.IPostPackageService;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/packages")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_admin')")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, maxAge = 3600)
public class AdminPostPackageController {

    private final IPostPackageService service;

    /**
     * Lấy danh sách tất cả gói dịch vụ
     */
    @GetMapping
    public ResponseEntity<List<PostPackageDTO>> getAll() {
        log.info("📦 Fetching all packages");
        List<PostPackageDTO> packages = service.getAllPackages();
        return ResponseEntity.ok(packages);
    }

    /**
     * Lấy gói dịch vụ theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PostPackageDTO> getById(@PathVariable Integer id) {
        log.info("📦 Fetching package ID: {}", id);
        return ResponseEntity.ok(service.getPackageById(id));
    }

    /**
     * Tạo gói dịch vụ mới
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody PostPackageDTO dto) {
        log.info("➕ Creating package: {}", dto.getPackageName());
        try {
            PostPackageDTO created = service.createPackage(dto);
            log.info("✅ Package created successfully: ID {}", created.getPackageID());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Tạo gói thành công",
                    "data", created
            ));
        } catch (Exception e) {
            log.error("❌ Error creating package: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Cập nhật gói dịch vụ
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable Integer id,
            @RequestBody PostPackageDTO dto) {
        log.info("✏️ Updating package ID: {}", id);
        try {
            PostPackageDTO updated = service.updatePackage(id, dto);
            log.info("✅ Package updated successfully: ID {}", id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Cập nhật gói thành công",
                    "data", updated
            ));
        } catch (Exception e) {
            log.error("❌ Error updating package: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Xóa gói dịch vụ
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Integer id) {
        log.info("🗑️ Deleting package ID: {}", id);
        try {
            service.deletePackage(id);
            log.info("✅ Package deleted successfully: ID {}", id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Xoá gói thành công"
            ));
        } catch (Exception e) {
            log.error("❌ Error deleting package: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Ẩn/Hiển thị gói (cập nhật isHidden)
     */
    @PatchMapping("/{id}/toggle-hidden")
    public ResponseEntity<Map<String, Object>> toggleHidden(@PathVariable Integer id) {
        log.info("👁️ Toggling hidden status for package ID: {}", id);
        try {
            PostPackageDTO updated = service.toggleHidden(id);
            log.info("✅ Package hidden status toggled: ID {}", id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", updated.getIsHidden() ? "Đã ẩn gói" : "Đã hiện gói",
                    "data", updated
            ));
        } catch (Exception e) {
            log.error("❌ Error toggling hidden status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * (Optional) Ẩn/Hiển thị gói (legacy - dùng boolean toggle)
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Map<String, Object>> toggleVisibility(@PathVariable Integer id) {
        log.info("👁️ Toggling visibility for package ID: {}", id);
        try {
            PostPackageDTO updated = service.toggleHidden(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", updated.getIsHidden() ? "Đã ẩn gói" : "Đã hiện gói",
                    "data", updated
            ));
        } catch (Exception e) {
            log.error("❌ Error toggling visibility: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}