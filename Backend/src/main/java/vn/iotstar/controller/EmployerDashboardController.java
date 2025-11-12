package vn.iotstar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.iotstar.dto.EmployerDashboardStatsDTO;
import vn.iotstar.entity.Account;
import vn.iotstar.repository.IAccountRepository;
import vn.iotstar.service.IEmployerDashboardService;

@RestController
@RequestMapping("/api/employer")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@PreAuthorize("hasAuthority('ROLE_employer')")
@RequiredArgsConstructor
public class EmployerDashboardController {
    
    private final IEmployerDashboardService dashboardService;
    private final IAccountRepository accountRepository;
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<EmployerDashboardStatsDTO> getDashboardStats() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                return ResponseEntity.status(401).build();
            }

            String username = auth.getName();
            Account account = accountRepository.findByUsername(username);
            
            if (account == null) {
                return ResponseEntity.status(404).build();
            }

            Integer accountId = account.getAccountID();
            
            EmployerDashboardStatsDTO stats = dashboardService.getEmployerStats(accountId);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}