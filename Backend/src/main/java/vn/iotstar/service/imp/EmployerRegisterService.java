package vn.iotstar.service.imp;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import vn.iotstar.dto.EmployerRegisterDTO;
import vn.iotstar.entity.Account;
import vn.iotstar.entity.Employer;
import vn.iotstar.entity.Role;
import vn.iotstar.repository.IAccountRepository;
import vn.iotstar.repository.IEmployerRegisterRepository;
import vn.iotstar.repository.IRoleRepository;
import vn.iotstar.service.IEmployerRegisterService;


class RegistrationAttempt {
    public EmployerRegisterDTO dto;
    public LocalDateTime expiryTime;

    public RegistrationAttempt(EmployerRegisterDTO dto, LocalDateTime expiryTime) {
        this.dto = dto;
        this.expiryTime = expiryTime;
    }
}

@Service
public class EmployerRegisterService implements IEmployerRegisterService {

    @Autowired
    private IAccountRepository accountRepository;

    @Autowired
    private IEmployerRegisterRepository employerRegisterRepository;

    @Autowired
    private IRoleRepository roleRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

  
    private Map<String, RegistrationAttempt> verificationTokens = new ConcurrentHashMap<>();
    private static final int EXPIRY_MINUTES = 30; // hạn sau 30 phút

    @Override
    public String registerEmployer(EmployerRegisterDTO dto) {
//        if (accountRepository.findByUsername(dto.getUsername()) != null) {
//            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tên đăng nhập đã tồn tại");
//        }
        if (accountRepository.findByEmail(dto.getEmail()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã được đăng ký");
        }

        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        dto.setPassword(encodedPassword);

        String token = UUID.randomUUID().toString();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(EXPIRY_MINUTES);
        verificationTokens.put(token, new RegistrationAttempt(dto, expiryTime));

        emailService.sendVerificationEmail(dto.getEmail(), token);
        return "Đăng ký thành công, vui lòng kiểm tra email để xác thực.";
    }

    @Override
    public String verifyEmail(String token) {
        
        RegistrationAttempt attempt = verificationTokens.get(token);
        
        if (attempt == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token không hợp lệ.");
        }
        if (attempt.expiryTime.isBefore(LocalDateTime.now())) {
            verificationTokens.remove(token); 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token đã hết hạn.");
        }
        
      
        if (accountRepository.findByUsername(attempt.dto.getEmail()) != null) {
             verificationTokens.remove(token); // Xóa token 
             return "Lỗi: Email đã được đăng ký bởi tài khoản khác trong thời gian chờ!";
        }
        
        EmployerRegisterDTO dto = attempt.dto;
        
        try {
            Role role = roleRepository.findById(2).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Role không tồn tại")
            );
            
      
            Account account = new Account();
            account.setUsername(dto.getUsername()); 
            account.setEmail(dto.getEmail());       
            account.setPassword(dto.getPassword()); 
            account.setActive(1);                 
            account.setRole(role);
            account.setProvider("local");
            Account savedAccount = accountRepository.save(account);

           
            Employer employer = new Employer();
            employer.setFullName(dto.getCompanyName());
            employer.setRepresentative(dto.getContactPerson());
            employer.setPhone(dto.getPhoneNumber());
            employer.setAccount(savedAccount); 
            employerRegisterRepository.save(employer);
            
            verificationTokens.remove(token);
            
            return "Xác thực email thành công!";
            
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi lưu dữ liệu sau khi xác thực: " + e.getMessage());
        }
    }
}