package vn.iotstar.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.iotstar.dto.ApplicantDetailDTO;
import vn.iotstar.service.IApplicantService;

@RestController
@RequestMapping("/api/employer")
@PreAuthorize("hasAuthority('ROLE_employer')")
@RequiredArgsConstructor
public class EmployerApplicantController {

    private final IApplicantService applicantService;

    @GetMapping("/applicant/detail/{id}")
    public ResponseEntity<ApplicantDetailDTO> getApplicantDetail(@PathVariable Integer id) {
        return applicantService.getApplicantDetailById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
