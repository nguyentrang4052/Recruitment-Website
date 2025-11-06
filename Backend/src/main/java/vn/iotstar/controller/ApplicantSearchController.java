package vn.iotstar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; 
import org.springframework.web.bind.annotation.*;

import vn.iotstar.dto.ApplicantDTO;
import vn.iotstar.dto.ApplicantDetailDTO; 
import vn.iotstar.dto.ApplicantSearchDTO;
import vn.iotstar.service.IApplicantService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/employer") 
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") 
public class ApplicantSearchController { 

    @Autowired
    private IApplicantService applicantService;

    @PostMapping("/search_applicant") 
    public ResponseEntity<Map<String, Object>> searchApplicants(@RequestBody ApplicantSearchDTO searchDTO) {
        try {
            if (searchDTO.getPage() < 0 || searchDTO.getSize() <= 0) {
                 return new ResponseEntity<>(Map.of("message", "Tham số phân trang không hợp lệ."), HttpStatus.BAD_REQUEST);
            }
            
            Page<ApplicantDTO> applicantsPage = applicantService.searchAndFilterApplicants(searchDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("candidates", applicantsPage.getContent());
            response.put("currentPage", applicantsPage.getNumber()); 
            response.put("totalPages", applicantsPage.getTotalPages());
            response.put("totalResults", applicantsPage.getTotalElements());

            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch (Exception e) {
            System.err.println("Lỗi tìm kiếm ứng viên: " + e.getMessage());
            return new ResponseEntity<>(Map.of("message", "Lỗi server trong quá trình tìm kiếm."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


     
    @GetMapping("/applicant/{id}") 
    public ResponseEntity<ApplicantDetailDTO> getApplicantDetails(@PathVariable("id") Integer id) {
        
  
        Optional<ApplicantDetailDTO> applicantDetail = applicantService.getApplicantDetailById(id);
        
        return applicantDetail.map(dto -> new ResponseEntity<>(dto, HttpStatus.OK))
                        .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}