package vn.iotstar.service.imp;

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
import vn.iotstar.service.EmailService;
import vn.iotstar.service.IEmployerRegisterService;

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

    private Map<String, Integer> verificationTokens = new ConcurrentHashMap<>();

    @Override
    public String registerEmployer(EmployerRegisterDTO dto) {


        if (accountRepository.findByUsername(dto.getEmail()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại");
        }

        Account account = new Account();
        account.setUsername(dto.getUsername());
        account.setEmail(dto.getEmail());
        account.setPassword(passwordEncoder.encode(dto.getPassword()));
        account.setActive(0);
        account.setProvider("employer");

        Role role = roleRepository.findById(2).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Role không tồn tại")
        );
        account.setRole(role);
        accountRepository.save(account);

        Employer employer = new Employer();
        employer.setEmployerName(dto.getCompanyName());
        employer.setRepresentative(dto.getContactPerson());
        employer.setPhone(dto.getPhoneNumber());
        employer.setAccount(account);
        
        employerRegisterRepository.save(employer);

  
        String token = UUID.randomUUID().toString();
        verificationTokens.put(token, account.getAccountID());
        emailService.sendVerificationEmail(account.getEmail(), token);

        return "Đăng ký thành công, vui lòng kiểm tra email để xác thực";
    }

    @Override
    public String verifyEmail(String token) {
        Integer accountId = verificationTokens.get(token);
        if (accountId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token không hợp lệ hoặc đã hết hạn");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tài khoản không tồn tại"));

        account.setActive(1);
        accountRepository.save(account);
        verificationTokens.remove(token);

        return "Xác thực email thành công!";
    }
}
