package vn.iotstar.service.imp;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import vn.iotstar.entity.Applicant;
import vn.iotstar.repository.IAccountRepository;
import vn.iotstar.repository.IApplicantRepository;
import vn.iotstar.repository.IRecruitmentRepository;
import vn.iotstar.service.IApplicantService;

@Service
@RequiredArgsConstructor
public class ApplicantService implements IApplicantService {
	
	@Autowired
	private IApplicantRepository applicantRepository;
	
	@Autowired 
	private IAccountRepository accountRepository;
	
	@Autowired
	private IRecruitmentRepository recruitmentRepo;
	

	@Override
	public <S extends Applicant> S save(S entity) {
		return applicantRepository.save(entity);
	}

	@Override
	public long count() {
		return applicantRepository.count();
	}
	
	@Value("${upload.cv.dir}")
	private String uploadDir;

	
	@Override
	public Applicant findByAccount_accountID(Integer accountId) {
		return applicantRepository.findByAccount_accountID(accountId);
	}

	@Override
	public String storeFile(MultipartFile file) {
	    if (file.isEmpty()) throw new IllegalArgumentException("Empty file");

	    String original = file.getOriginalFilename();
	    String ext = Optional.ofNullable(original)
	                         .filter(f -> f.contains("."))
	                         .map(f -> f.substring(original.lastIndexOf(".")))
	                         .orElse("");
	    String stored = System.currentTimeMillis() + "_" + UUID.randomUUID() + ext;

	    Path destination = Paths.get(uploadDir, stored);
	    try {
	        Files.createDirectories(destination.getParent());
	        Files.copy(file.getInputStream(), destination);
	    } catch (IOException e) {
	        throw new RuntimeException("Lỗi lưu file", e);
	    }
	    return stored;  
	}
}
