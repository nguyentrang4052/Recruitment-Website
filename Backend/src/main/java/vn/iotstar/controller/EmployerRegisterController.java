package vn.iotstar.controller;

import jakarta.servlet.http.HttpServletResponse;  
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.iotstar.dto.EmployerRegisterDTO;
import vn.iotstar.service.IEmployerRegisterService;

import java.util.Map;

@RestController
@RequestMapping("/api/employer")
public class EmployerRegisterController {

    @Autowired
    private IEmployerRegisterService employerRegisterService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody EmployerRegisterDTO dto) {
        try {
            String msg = employerRegisterService.registerEmployer(dto);
            return ResponseEntity.ok(Map.of("message", msg));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Đăng ký thất bại: " + e.getMessage()));
        }
    }

    @GetMapping("/register/verify")
    public void verifyEmail(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        try {
            String msg = employerRegisterService.verifyEmail(token);

            if ("Xác thực email thành công!".equals(msg)) {
            	
                response.sendRedirect("http://localhost:5173/login");
            } else {
                response.setContentType("text/html;charset=UTF-8");
                response.getWriter().write("<h3>" + msg + "</h3>");
            }
        } catch (Exception e) {
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().write("<h3>Xác thực thất bại: " + e.getMessage() + "</h3>");
        }
    }
}
