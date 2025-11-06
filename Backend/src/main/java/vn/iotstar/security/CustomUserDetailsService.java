package vn.iotstar.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import vn.iotstar.entity.Account;
import vn.iotstar.service.IAccountService;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private IAccountService accountService;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Account account = accountService.findByUsername(username);
		if (account == null) {
			throw new UsernameNotFoundException("Không tìm thấy người dùng: " + username);
		}
		return new CustomUserDetail(account);
		
	}
}
