package vn.iotstar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.io.File;
import java.util.Map;

import vn.iotstar.dto.EmployerInfoDTO;
import vn.iotstar.service.IEmployerInfoService;

@RestController
@RequestMapping("/api/employer")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EmployerInfoController {

    @Autowired
    private IEmployerInfoService employerService; 

    @GetMapping("/info")
    public EmployerInfoDTO getEmployerInfo(@RequestParam String username) {
        return employerService.getEmployerInfoByUsername(username);
    }
    
    @PutMapping("/update")
    public ResponseMessage updateEmployer(@RequestBody EmployerInfoDTO dto) {
        String message = employerService.updateEmployerInfo(dto);
        return new ResponseMessage(message);
    }

    @PostMapping("/uploadLogo")
    public Map<String, String> uploadLogo(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chưa chọn file");
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File dest = new File(uploadDir + fileName);
            dest.getParentFile().mkdirs();
            file.transferTo(dest);

            String fileUrl = "/uploads/" + fileName;
            return Map.of("url", fileUrl);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Upload thất bại");
        }
    }
    
    @PostMapping("/uploadImage")
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chưa chọn file");
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String uploadDir = System.getProperty("user.dir") + "/uploads/company/";
            File dest = new File(uploadDir + fileName);
            dest.getParentFile().mkdirs();
            file.transferTo(dest);

            String fileUrl = "/uploads/company/" + fileName;
            return Map.of("url", fileUrl);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Upload ảnh thất bại");
        }
    }
    
    static class ResponseMessage {
        private String message;
        public ResponseMessage(String message) { this.message = message; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
