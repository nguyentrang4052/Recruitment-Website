package vn.iotstar.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.iotstar.dto.PostPackageDTO;
import vn.iotstar.service.IPostPackageService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/packages")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_admin')")
@SecurityRequirement(name = "bearerAuth")
public class AdminPostPackageController {

    private final IPostPackageService service;


    @GetMapping
    public ResponseEntity<List<PostPackageDTO>> getAll() {
        return ResponseEntity.ok(service.getAllPackages());
    }

 
    @GetMapping("/{id}")
    public ResponseEntity<PostPackageDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getPackageById(id));
    }


    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody PostPackageDTO dto) {
        PostPackageDTO created = service.createPackage(dto);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Tạo gói thành công",
                "data", created
        ));
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable Integer id,
            @RequestBody PostPackageDTO dto) {
        PostPackageDTO updated = service.updatePackage(id, dto);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cập nhật gói thành công",
                "data", updated
        ));
    }

 
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Integer id) {
        service.deletePackage(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Xoá gói thành công"
        ));
    }

 
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Map<String, Object>> toggleVisibility(@PathVariable Integer id) {
        boolean hidden = service.toggleHidden(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", hidden ? "Đã ẩn gói" : "Đã hiện gói"
        ));
    }
}