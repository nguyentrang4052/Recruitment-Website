package vn.iotstar.security;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import vn.iotstar.entity.Account;

public class CustomUserDetail implements UserDetails {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Account account;

	
	public CustomUserDetail(Account account) {
		this.account = account;
	}
	
	public Account getAccount() {
		return account;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		if (account.getRole() == null) return Collections.emptyList();

	    String roleName = account.getRole().getRoleName();
	    return List.of(new SimpleGrantedAuthority("ROLE_" + roleName.toUpperCase()));
	}

	@Override
	public String getPassword() {
		return account.getPassword();
	}

	@Override
	public String getUsername() {
		return account.getUsername();
	}
	
	@Override
	public boolean isAccountNonExpired() {
	    return true;
	}

	@Override
	public boolean isAccountNonLocked() {
	    return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
	    return true;
	}

	@Override
	public boolean isEnabled() {
	    return true;
	}


}
