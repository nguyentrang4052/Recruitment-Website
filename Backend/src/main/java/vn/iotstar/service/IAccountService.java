package vn.iotstar.service;

import java.util.List;
import java.util.Optional;

import vn.iotstar.dto.ForgotPassRequestDTO;
import vn.iotstar.dto.ForgotPassResponeDTO;
import vn.iotstar.dto.OtpRequestDTO;
import vn.iotstar.dto.SignupRequestDTO;
import vn.iotstar.dto.SignupResponseDTO;
import vn.iotstar.entity.Account;

public interface IAccountService {

	Optional<Account> findById(Integer id);

	<S extends Account> S save(S entity);

	Account findByUsername(String username);

	List<Account> findAll();

	boolean existsByUsername(String username);

	boolean existsByEmail(String email);

	SignupResponseDTO registerUser(SignupRequestDTO signupRequestDTO);

	SignupResponseDTO verifyOtp(OtpRequestDTO req);

	Account findByEmail(String email);

	ForgotPassResponeDTO updatPass(ForgotPassRequestDTO req);

	String loginByGoogle(String idTokenString) throws Exception;

//	String getRoleFromUsername(String username);
}
