package vn.iotstar.controller;

import jakarta.validation.Valid;

import org.apache.catalina.security.SecurityUtil;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.iotstar.dto.ApplicantDTO;
import vn.iotstar.dto.ApplicantDetailDTO;
import vn.iotstar.dto.ApplicantSearchDTO;
import vn.iotstar.entity.EmployerPackageLimit;
import vn.iotstar.repository.IEmployerPackageLimitRepository;
import vn.iotstar.service.IApplicantService;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/employer")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@PreAuthorize("hasAuthority('ROLE_employer')")
@RequiredArgsConstructor
public class ApplicantSearchController {

    private final IApplicantService applicantService;
    private final IEmployerPackageLimitRepository employerLimitRepo; 

    @PostMapping("/search_applicant")
    public ResponseEntity<Map<String, Object>> searchApplicants(
            @Valid @RequestBody ApplicantSearchDTO searchDTO) {

        try {
            Integer employerID = getCurrentEmployerID();

         
            EmployerPackageLimit limit = employerLimitRepo
                    .findByEmployer_EmployerID(employerID)
                    .orElse(null);

         
            if (limit == null) {
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(Map.of(
                    "message", "Bạn chưa đăng ký gói dịch vụ nào. Vui lòng đăng ký để sử dụng tính năng tìm kiếm ứng viên.",
                    "errorType", "NO_PACKAGE"
                ));
            }

         
            if (limit.getExpiryDate().isBefore(java.time.LocalDate.now())) {
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(Map.of(
                    "message", "Gói dịch vụ của bạn đã hết hạn vào " + limit.getExpiryDate() + ". Vui lòng gia hạn để tiếp tục sử dụng.",
                    "errorType", "EXPIRED",
                    "expiryDate", limit.getExpiryDate().toString()
                ));
            }

           
            Integer cvViewsLeft = limit.getCvViewsLeft();
            Integer maxCvViews = limit.getMaxCvViews();
            
           
            if (maxCvViews != null && (cvViewsLeft == null ? false : cvViewsLeft <= 0)) {
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(Map.of(
                    "message", "Bạn không có lượt xem CV trong gói hiện tại.",
                    "errorType", "NO_CV_VIEWS_LEFT",
                    "cvViewsLeft", cvViewsLeft == null ? "Không giới hạn" : cvViewsLeft,
                    "maxCvViews", maxCvViews
                ));
            }

         
            Integer cvLimit = cvViewsLeft == null ? Integer.MAX_VALUE : cvViewsLeft;
            var candidates = applicantService.searchAndFilterApplicantsLimit(searchDTO, cvLimit);

            Map<String, Object> response = new HashMap<>();
            response.put("candidates", candidates);
            response.put("totalResults", candidates.size());
            response.put("cvViewsLeft", cvViewsLeft);
            response.put("maxCvViews", maxCvViews);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Dữ liệu đầu vào không hợp lệ: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi server: " + e.getMessage()));
        }
    }

    @GetMapping("/applicant/{id}")
    public ResponseEntity<ApplicantDetailDTO> getApplicantDetails(@PathVariable Integer id) {
        return applicantService.getApplicantDetailById(id)
                .map(dto -> ResponseEntity.ok(dto))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    private Integer getCurrentEmployerID() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Người dùng chưa đăng nhập");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof vn.iotstar.security.CustomUserDetail userDetail) {
            var account = userDetail.getAccount();
            if (account != null && account.getEmployer() != null) {
                return account.getEmployer().getEmployerID();
            }
        }

        throw new RuntimeException("Không thể xác định employer từ tài khoản hiện tại");
    }
}