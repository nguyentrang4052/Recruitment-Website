package vn.iotstar.service.imp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import vn.iotstar.entity.Account;
import vn.iotstar.service.IAccountService;

@Component
public class EncodePassService {
	@Autowired
	private IAccountService accountService;
	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostConstruct
	public void encodePasswords() {
		List<Account> accounts = accountService.findAll();

		for (Account acc : accounts) {
			String rawPass = acc.getPassword();

			if (!rawPass.startsWith("$2a$")) {
				String encodedPass = passwordEncoder.encode(rawPass);
				acc.setPassword(encodedPass);
				accountService.save(acc);
			}
		}
	}
}