package vn.iotstar.service.imp;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import vn.iotstar.entity.Account;
import vn.iotstar.repository.IAccountRepository;
import vn.iotstar.service.IAccountService;

import vn.iotstar.dto.*;
import vn.iotstar.entity.*;
import vn.iotstar.repository.*;
import vn.iotstar.security.JwtUtil;
import vn.iotstar.service.*;
import vn.iotstar.util.SecurityUtil;
import java.util.List;
import java.util.Optional;


@Service
public class AccountService implements IAccountService {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Autowired
	private IAccountRepository accountRepository;

	@Autowired
	private IRoleRepository roleRepository;

	@Autowired
	private SecurityUtil securityUtil;

	@Autowired
	private JwtUtil jwtUtil;

	 private String googleClientId = "393089958981-77pg8slhbj7eoceklnrunm4ofb0jd1k9.apps.googleusercontent.com";

	public AccountService(IAccountRepository accountRepository) {
		this.accountRepository = accountRepository;
	}

	@Override
	public List<Account> findAll() {
		return accountRepository.findAll();
	}

	@Override
	public Account findByUsername(String username) {
		return accountRepository.findByUsername(username);
	}

	@Override
	public Account findByEmail(String email) {
		return accountRepository.findByEmail(email);
	}

	@Override

	public <S extends Account> S save(S entity) {
		return accountRepository.save(entity);
	}

	@Override
	public Optional<Account> findById(Integer id) {
		return accountRepository.findById(id);
	}

	@Override
	public boolean existsByEmail(String email) {
		return accountRepository.existsByEmail(email);
	}

	@Override
	public boolean existsByUsername(String username) {
		return accountRepository.existsByUsername(username);
	}


	@Override
	public SignupResponseDTO registerUser(SignupRequestDTO signupRequestDTO) {
		try {

			if (accountRepository.existsByEmail(signupRequestDTO.getEmail())) {
				throw new RuntimeException("Email đã tồn tại");
			}

			if (accountRepository.existsByUsername(signupRequestDTO.getUsername())) {
				throw new RuntimeException("Tên đăng nhập đã tồn tại");
			}

			if (!signupRequestDTO.getPassword().equals(signupRequestDTO.getConfirmPassword())) {
				throw new RuntimeException("Mật khẩu không khớp");
			}

			String hashedPassword = new BCryptPasswordEncoder().encode(signupRequestDTO.getPassword());

			signupRequestDTO.setPassword(hashedPassword);
			signupRequestDTO.setConfirmPassword(hashedPassword);

			if (securityUtil.sendOtp(signupRequestDTO.getEmail())) {

				securityUtil.saveSignupRequestToRedis(signupRequestDTO.getEmail(), (Object) signupRequestDTO);

				return new SignupResponseDTO("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận OTP.", true);
			} else {
				return new SignupResponseDTO("Không thể gửi OTP. Vui lòng thử lại.", false);
			}

		} catch (Exception e) {
			e.printStackTrace();
			return new SignupResponseDTO("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.", false);
		}
	}

	@Override
	public SignupResponseDTO verifyOtp(OtpRequestDTO req) {
		try {
			if (!securityUtil.verifyOtp(req.getEmail(), req.getOtp())) {
				return new SignupResponseDTO("OTP không hợp lệ hoặc đã hết hạn", false);
			}

			String json = securityUtil.getSignupDataFromRedis(req.getEmail());
			if (json == null) {
				return new SignupResponseDTO("Không tìm thấy dữ liệu đăng ký", false);
			}

			ObjectMapper mapper = new ObjectMapper();
			SignupRequestDTO signupRequestDTO = mapper.readValue(json, SignupRequestDTO.class);

			Role role = roleRepository.findByRoleName("applicant");
			if (role == null) {
				role = new Role();
				role.setRoleName("applicant");
			}

			Applicant newApplicant = new Applicant();
			newApplicant.setApplicantName(signupRequestDTO.getApplicantName());

			Account newAccount = new Account();
			newAccount.setUsername(signupRequestDTO.getUsername());
			newAccount.setEmail(signupRequestDTO.getEmail());
			newAccount.setPassword(signupRequestDTO.getPassword());
			newAccount.setProvider("local");
			newAccount.setApplicant(newApplicant);
			newAccount.setActive(1);
			newAccount.setRole(role);

			newAccount.setApplicant(newApplicant);
			newApplicant.setAccount(newAccount);

			accountRepository.save(newAccount);

			securityUtil.deleteSignupData(req.getEmail());

			return new SignupResponseDTO("Xác thực thành công", true);
		} catch (Exception e) {
			e.printStackTrace();
			return new SignupResponseDTO("Xác thực không thành công", false);
		}
	}

	@Override
	public ForgotPassResponeDTO updatPass(ForgotPassRequestDTO req) {
		try {

			if (!securityUtil.verifyOtp(req.getEmail(), req.getOtp())) {
				return new ForgotPassResponeDTO("OTP không hợp lệ hoặc đã hết hạn", false);
			}

			Account account = accountRepository.findByEmail(req.getEmail());

			if (account == null) {
				return new ForgotPassResponeDTO("Không tìm thấy dữ liệu đăng ký", false);
			} else {
				String hashedPassword = new BCryptPasswordEncoder().encode(req.getPassword());
				account.setPassword(hashedPassword);
				accountRepository.save(account);
				return new ForgotPassResponeDTO("Đổi mật khẩu thành công", true);
			}

		} catch (Exception e) {
			e.printStackTrace();
			return new ForgotPassResponeDTO("Đổi mật khẩu không thành công", false);
		}

	}

	@Override
	public String loginByGoogle(String idTokenString) throws Exception {

		GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
				GsonFactory.getDefaultInstance()).setAudience(Collections.singletonList(googleClientId)).build();
		GoogleIdToken idToken = verifier.verify(idTokenString);
		if (idToken == null) {
			throw new IllegalArgumentException("Invalid ID token");
		}
		Payload payload = idToken.getPayload();

		String email = payload.getEmail();

		String name = (String) payload.get("name");

		Account account = accountRepository.findByEmail(email);
		if (account == null) {
			Role role = roleRepository.findByRoleName("applicant");

			Applicant applicant = new Applicant();
			applicant.setApplicantName(name);
			account = new Account();
			account.setEmail(email);
			account.setUsername(null);
			account.setPassword(null);
			account.setApplicant(applicant);
			account.setRole(role);
			account.setActive(1);

			account.setProvider("google");
			applicant.setAccount(account);
			accountRepository.save(account);
		}

		return jwtUtil.generateToken(account.getEmail(), "google");
	}

	@Override
	public Account findByApplicant_ApplicantID(Integer applicantID) {
		return accountRepository.findByApplicant_ApplicantID(applicantID);
	}
	
	

}
