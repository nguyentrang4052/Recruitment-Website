package vn.iotstar.service.imp;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.iotstar.entity.Account;
import vn.iotstar.repository.IAccountRepository;
import vn.iotstar.service.IEmployerSettingService;

@Service
@RequiredArgsConstructor
public class EmployerSettingService implements IEmployerSettingService {

    private final IAccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String getCurrentEmail(Integer accountId) {
        return accountRepo.findById(accountId).map(Account::getEmail).orElseThrow();
    }

    @Override
    @Transactional
    public void updatePassword(Integer accountId, String oldPass, String newPassword) {
        Account acc = accountRepo.findById(accountId).orElseThrow();
        if (!passwordEncoder.matches(oldPass, acc.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng!");
        }      	
        acc.setPassword(passwordEncoder.encode(newPassword));
        accountRepo.save(acc);
    }

    @Override
    @Transactional
    public void updateEmail(Integer accountId, String newEmail) {
        Account acc = accountRepo.findById(accountId).orElseThrow();
        acc.setEmail(newEmail);
    }
}
