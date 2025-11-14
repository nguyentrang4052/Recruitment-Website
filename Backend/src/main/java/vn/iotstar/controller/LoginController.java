package vn.iotstar.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import vn.iotstar.dto.*;
import vn.iotstar.entity.Account;
import vn.iotstar.entity.Applicant;

import vn.iotstar.entity.Employer;
import vn.iotstar.security.*;
import vn.iotstar.service.IAccountService;
import vn.iotstar.service.IApplicantService;
import vn.iotstar.service.IEmployerService;

@Controller
@RequestMapping("/api/auth")
public class LoginController {
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private CustomUserDetailsService uService;
	
	@Autowired
	private IAccountService accountService;
	
	@Autowired
	private IApplicantService applicantService;
	
	// @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
    //     try {
    //         Authentication authentication = authenticationManager.authenticate(
    //             new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
    //         );

    //         CustomUserDetail userDetails = (CustomUserDetail) uService.loadUserByUsername(loginRequest.getUsername());

    //         Account account = userDetails.getAccount(); 

    //         String token = jwtUtil.generateToken(userDetails.getUsername(), "local");
            
    //         Applicant applicant = applicantService.findByAccount_accountID(account.getAccountID());
    //         LoginResponseDTO response = new LoginResponseDTO();
    //         response.setToken(token);
    //         response.setUsername(account.getUsername());
    //         response.setEmail(account.getEmail());
    //         response.setRoleName(account.getRole().getRoleName());
    //         response.setApplicantID(applicant.getApplicantID());

    //         return ResponseEntity.ok(response);

    //     } catch (BadCredentialsException e) {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tên người dùng hoặc mật khẩu không đúng");
    //     }
	//  }
	@PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody LoginGGRequestDTO req) throws Exception {
        String idTokenString = req.getIdToken();     
        try {
        	String token = accountService.loginByGoogle(idTokenString);
            if (token != null) {
            	String email = jwtUtil.extractUsername(token);
            	Account account  = accountService.findByEmail(email);
            	Applicant applicant = applicantService.findByAccount_accountID(account.getAccountID());
            	Map<String, Object> response = new HashMap<>();
            	response.put("token", token);
            	response.put("email", email);
            	response.put("roleName", account.getRole().getRoleName());
            	response.put("applicantID", applicant.getApplicantID());
            	
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID token");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying token");
        }
    }


	@Autowired
	private IEmployerService employerService;
	
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
	    try {
	        Authentication authentication = authenticationManager.authenticate(
	            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
	        );

	        CustomUserDetail userDetails = (CustomUserDetail) uService.loadUserByUsername(loginRequest.getUsername());
	        Account account = userDetails.getAccount();
	        
	        
	        String token = jwtUtil.generateToken(account.getUsername(), account.getProvider());

	        LoginResponseDTO response = new LoginResponseDTO();
	        response.setToken(token);
	        response.setUsername(account.getUsername());
	        response.setEmail(account.getEmail());
	        response.setRoleName(account.getRole().getRoleName());

	
	        String role = account.getRole().getRoleName().toUpperCase();

	        if (role.equals("APPLICANT")) {
	            Applicant applicant = applicantService.findByAccount_accountID(account.getAccountID());
	            if (applicant != null) response.setApplicantID(applicant.getApplicantID());
	        } 
	        else if (role.equals("EMPLOYER")) {
	            Employer employer = employerService.findByAccount_accountID(account.getAccountID());
	            if (employer != null) response.setEmployerID(employer.getEmployerID());
	        }

	        return ResponseEntity.ok(response);

	    } catch (BadCredentialsException e) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body("Tên người dùng hoặc mật khẩu không đúng");
	    }
	}

	
}
