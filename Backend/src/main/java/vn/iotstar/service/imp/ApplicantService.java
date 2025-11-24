package vn.iotstar.service.imp;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.text.DecimalFormat;
import java.util.*;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import vn.iotstar.dto.ApplicantDTO;
import vn.iotstar.dto.ApplicantSearchDTO;
import vn.iotstar.dto.applicant.EmployerCardDTO;
import vn.iotstar.dto.applicant.ProfileDTO;
import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.dto.ApplicantDetailDTO;
import vn.iotstar.dto.ApplicationDTO;
import vn.iotstar.entity.CareerInformation;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.entity.Skill;

import lombok.RequiredArgsConstructor;
import vn.iotstar.entity.Account;
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.Application;
import vn.iotstar.repository.IAccountRepository;
import vn.iotstar.repository.IApplicantRepository;
import vn.iotstar.repository.IRecruitmentRepository;
import vn.iotstar.service.IApplicantService;

@Service("applicantService")
@RequiredArgsConstructor
@Transactional
public class ApplicantService implements IApplicantService {

	@PersistenceContext
	private EntityManager entityManager;

	@Autowired
	private IApplicantRepository applicantRepository;

	@Autowired
	private IAccountRepository accountRepository;

	@Autowired
	private IRecruitmentRepository recruitmentRepo;
	

	@Value("${upload.cv.dir}")
	private String uploadDir;

	@Override
	public <S extends Applicant> S save(S entity) {
		return applicantRepository.save(entity);
	}

	@Override
	public long count() {
		return applicantRepository.count();
	}

	@Override
	public Applicant findByAccount_accountID(Integer accountId) {
		return applicantRepository.findByAccount_accountID(accountId);
	}

	@Override
	public String storeFile(MultipartFile file) {
		if (file.isEmpty())
			throw new IllegalArgumentException("Empty file");

		String original = file.getOriginalFilename();
		String ext = Optional.ofNullable(original).filter(f -> f.contains("."))
				.map(f -> f.substring(original.lastIndexOf("."))).orElse("");
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
	
	@Override
    @Transactional(readOnly = true)
    public Optional<ApplicantDetailDTO> getApplicantDetailById(Integer applicantID) {
        return applicantRepository.findByApplicantID(applicantID)
                .map(this::convertToDetailDTO);
    }

	private ApplicantDTO convertToDTO(Applicant applicant) {
        ApplicantDTO dto = new ApplicantDTO();
        
        dto.setApplicantID(applicant.getApplicantID());
        dto.setApplicantName(applicant.getApplicantName());
        dto.setBirthday(applicant.getBirthday());
        dto.setGender(applicant.getGender());
        dto.setAddress(applicant.getAddress());
        dto.setPhone(applicant.getPhone());
    
        
        if (applicant.getAccount() != null) {
            dto.setEmail(applicant.getAccount().getEmail());
            dto.setPhoto(applicant.getAccount().getPhoto());
        }
        
        dto.setGoal(applicant.getGoal());
        dto.setExperience(applicant.getExperience());
        dto.setLiteracy(applicant.getLiteracy());

        CareerInformation ci = applicant.getCareerInformation();
        if (ci != null) {
            dto.setJobTitle(ci.getTitle());
            dto.setLocation(ci.getLocation());
            dto.setDesireLevel(ci.getDesireLevel());
            dto.setFormOfWork(ci.getFormOfWork() != null ? ci.getFormOfWork().toString() : null);
            dto.setDesireSalary(ci.getDesireSalary() != null ? ci.getDesireSalary() + " VND" : "Thỏa thuận");
        }

        if (applicant.getSkill() != null) {
            List<String> skillNames = applicant.getSkill().stream()
                .map(Skill::getSkillName)
                .collect(Collectors.toList());
            dto.setSkillNames(skillNames);
        }

        if (applicant.getApplication() != null && !applicant.getApplication().isEmpty()) {
            List<ApplicationDTO> appDtos = applicant.getApplication().stream()
                .map(app -> {
                    ApplicationDTO aDto = new ApplicationDTO();
                    aDto.setDate(app.getDate());
                    aDto.setStatus(app.getStatus().name());
                    aDto.setNote(app.getNote());
                    aDto.setCV(app.getCV());
                    aDto.setRecruitmentNewsTitle(app.getRecruitmentNews().getPosition());
                    return aDto;
                })
                .collect(Collectors.toList());
            dto.setApplications(appDtos);
        } else {
            dto.setApplications(Collections.emptyList());
        }

        return dto;
    }

      

	private ApplicantDetailDTO convertToDetailDTO(Applicant applicant) {
		ApplicantDetailDTO dto = new ApplicantDetailDTO();
		DecimalFormat formatter = new DecimalFormat("#,###");

		dto.setApplicantID(applicant.getApplicantID());
		dto.setApplicantName(applicant.getApplicantName());
		dto.setSummary(applicant.getGoal());
		dto.setExperience(applicant.getExperience());
		dto.setLiteracy(applicant.getLiteracy());
		dto.setPhone(applicant.getPhone());
		dto.setBirthday(applicant.getBirthday());
		dto.setGender(applicant.getGender());
		dto.setAddress(applicant.getAddress());
		
		if (applicant.getAccount() != null) {
            dto.setEmail(applicant.getAccount().getEmail());
            dto.setPhoto(applicant.getAccount().getPhoto());
        }
		
        CareerInformation ci = applicant.getCareerInformation();
        if (ci != null) {
            dto.setJobTitle(ci.getTitle());
            dto.setLocation(ci.getLocation());
            dto.setLevel(ci.getDesireLevel());
            dto.setDesireSalary(ci.getDesireSalary() != null ? 
                formatter.format(ci.getDesireSalary()) + " VND" : "Thỏa thuận");
        } else {
            dto.setDesireSalary("Thỏa thuận");
            dto.setLevel("Chưa rõ");
        }

        // Kỹ năng
        if (applicant.getSkill() != null && !applicant.getSkill().isEmpty()) {
            List<String> skillNames = applicant.getSkill().stream()
                                            .map(Skill::getSkillName)
                                            .collect(Collectors.toList());
            dto.setSkillNames(skillNames);
        } else {
            dto.setSkillNames(Collections.emptyList());
        }

        // Applications
        if (applicant.getApplication() != null && !applicant.getApplication().isEmpty()) {
            List<ApplicationDTO> appDtos = applicant.getApplication().stream()
                .map(app -> {
                    ApplicationDTO aDto = new ApplicationDTO();
                    aDto.setDate(app.getDate());
                    aDto.setStatus(app.getStatus() != null ? app.getStatus().name() : null);
                    aDto.setNote(app.getNote());
                    aDto.setCV("/uploads/cv/" + app.getCV());
                    if (app.getRecruitmentNews() != null) {
                        aDto.setRecruitmentNewsTitle(app.getRecruitmentNews().getPosition());
                        aDto.setRecruitmentNewsId(app.getRecruitmentNews().getRNID()); 
                    }
                    return aDto;
                })
                .collect(Collectors.toList());
            dto.setApplications(appDtos);
        } else {
            dto.setApplications(Collections.emptyList());
        }

		if (applicant.getSkill() != null) {
			List<String> skillNames = applicant.getSkill().stream().map(Skill::getSkillName)
					.collect(Collectors.toList());
			dto.setSkillNames(skillNames);
		} else {
			dto.setSkillNames(Collections.emptyList());
		}

		return dto;
	}

	@Override
	public Page<ApplicantDTO> searchAndFilterApplicants(ApplicantSearchDTO searchDTO) {

		String keyword = searchDTO.getSearchTerm() != null && !searchDTO.getSearchTerm().trim().isEmpty()
				? searchDTO.getSearchTerm().trim()
				: null;

		String location = searchDTO.getLocation() != null && !searchDTO.getLocation().trim().isEmpty()
				? searchDTO.getLocation().trim()
				: null;

		String desireLevel = searchDTO.getExperience() != null && !searchDTO.getExperience().trim().isEmpty()
				&& !searchDTO.getExperience().equalsIgnoreCase("Tất cả") ? searchDTO.getExperience().trim() : null;

		List<String> skills = searchDTO.getSkills() != null && !searchDTO.getSkills().isEmpty() ? searchDTO.getSkills()
				: null;

		Long skillCount = skills != null ? (long) skills.size() : 0L;

		Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize());

		Page<Applicant> applicantsPage;

		if (skills != null) {
			applicantsPage = applicantRepository.searchWithSkills(keyword, location, desireLevel, skills, skillCount,
					pageable);
		} else {
			applicantsPage = applicantRepository.searchWithoutSkills(keyword, location, desireLevel, pageable);
		}

		return applicantsPage.map(this::convertToDTO);
	}

	@Override
	public Applicant findByAccount_email(String email) {
		return applicantRepository.findByAccount_email(email);
	}

	private static void copyNonNull(Object src, Object dest, String... fields) {
		for (String f : fields) {
			try {
				Field dtoField = src.getClass().getDeclaredField(f);
				dtoField.setAccessible(true);
				Object value = dtoField.get(src);
				if (value != null) {
					Field entityField = dest.getClass().getDeclaredField(f);
					entityField.setAccessible(true);
					entityField.set(dest, value);
				}
			} catch (Exception ignore) {

			}
		}
	}

	@Override
	public ProfileDTO updateApplicant(Integer applicantID, ProfileDTO profileDTO) {
		
		Applicant existingApplicant = applicantRepository.findById(applicantID)
				.orElseThrow(() -> new RuntimeException("Ứng viên không tồn tại"));
		if (profileDTO.getGender() != null) {
	        Integer genderValue = null;
	        if (profileDTO.getGender().equalsIgnoreCase("male")) {
	            genderValue = 1;  
	        } else if (profileDTO.getGender().equalsIgnoreCase("female")) {
	            genderValue = 0;  
	        }
	        existingApplicant.setGender(genderValue);
	    }
		copyNonNull(profileDTO, existingApplicant.getAccount(), "photo");
		
		CareerInformation ci = existingApplicant.getCareerInformation();
		if (ci == null) {
		    ci = new CareerInformation();
		    ci.setApplicant(existingApplicant); 
		    existingApplicant.setCareerInformation(ci);
		}
		copyNonNull(profileDTO, ci, "title", "desireLevel", "formOfWork", "desireSalary",
				"location");
		copyNonNull(profileDTO, existingApplicant, "applicantName", "phone", "address", "birthday", "goal",
				"experience", "literacy", "skills");
		if (profileDTO.getSkills() != null)
			existingApplicant.setSkill(profileDTO.getSkills());
		applicantRepository.save(existingApplicant);
		return profileDTO;

	}

	@Override
	public void deleteFile(String fileName) {
		if (fileName == null)
			return;
		Path path = Paths.get(uploadDir, fileName);
		try {
			Files.deleteIfExists(path);
		} catch (IOException e) {
			throw new RuntimeException("Không thể xóa file: " + fileName, e);
		}
	}

	@Override
	public Optional<Applicant> findById(Integer id) {
		return applicantRepository.findById(id);
	}

//	@Override
//	public ProfileDTO mapToDetail(Applicant applicant) {
//
//		List<Skill> skill = applicant.getSkill();
//
//		return new ProfileDTO(applicant.getApplicantID(),applicant.getAccount().getPhoto(), applicant.getAccount().getEmail(), applicant.getApplicantName(), applicant.getPhone(),
//				applicant.getAddress(), applicant.getBirthday(), applicant.getGoal(), applicant.getExperience(),
//				applicant.getLiteracy(), skill, applicant.getCareerInformation().getTitle(),
//				applicant.getCareerInformation().getDesireLevel(), applicant.getCareerInformation().getDesireSalary(),
//				applicant.getCareerInformation().getFormOfWork(), applicant.getCareerInformation().getLocation());
//	}
	@Override
	public ProfileDTO mapToDetail(Applicant applicant) {

		List<Skill> skill = applicant.getSkill();

		CareerInformation ci = applicant.getCareerInformation();

		// Nếu career info null thì tạo 1 object rỗng để tránh NPE
		if (ci == null) {
			ci = new CareerInformation();
		}
		String gender;
		if (applicant.getGender() != null)
		{
			gender = applicant.getGender() == 0 ? "Nữ":"Nam";
		}else {
			gender = "Chưa có thông tin";
		}
		String active = applicant.getAccount().getActive() == 1 ? "Hoạt động" : "Bị khoá";
				

		return new ProfileDTO(applicant.getApplicantID(), applicant.getAccount().getPhoto(),
				applicant.getAccount().getEmail(), applicant.getApplicantName(), applicant.getPhone(),
				applicant.getAddress(), applicant.getBirthday(), applicant.getGoal(), applicant.getExperience(),
				applicant.getLiteracy(), skill, ci.getTitle(), ci.getDesireLevel(), ci.getDesireSalary(),
				ci.getFormOfWork(), ci.getLocation(), gender, active);
	}

	@Override
	public List<Applicant> findAll() {
		return applicantRepository.findAll();
	}
	
	@Override
	public void deleteApplicant(Integer id) {
		Account account = accountRepository.findByApplicant_ApplicantID(id);
		account.setActive(0);
		accountRepository.save(account);
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<ApplicantDTO> searchAndFilterApplicantsLimit(
	        ApplicantSearchDTO searchDTO, Integer cvViewsLeft) {

	    String keyword = searchDTO.getSearchTerm() != null && !searchDTO.getSearchTerm().trim().isEmpty()
	            ? searchDTO.getSearchTerm().trim() : null;
	    String location = searchDTO.getLocation() != null && !searchDTO.getLocation().trim().isEmpty()
	            ? searchDTO.getLocation().trim() : null;
	    String desireLevel = searchDTO.getExperience() != null && !searchDTO.getExperience().trim().isEmpty()
	            && !searchDTO.getExperience().equalsIgnoreCase("Tất cả")
	            ? searchDTO.getExperience().trim() : null;
	    List<String> skills = searchDTO.getSkills() != null && !searchDTO.getSkills().isEmpty()
	            ? searchDTO.getSkills() : null;
	    Long skillCount = skills != null ? (long) skills.size() : 0L;

	    // 👇 Giới hạn theo gói
	    int limit = cvViewsLeft != null && cvViewsLeft > 0 ? cvViewsLeft : 0;

	    List<Applicant> applicants;
	    if (skills != null) {
	        applicants = applicantRepository.searchWithSkillsLimit(
	                keyword, location, desireLevel, skills, skillCount, limit);
	    } else {
	        applicants = applicantRepository.searchWithoutSkillsLimit(
	                keyword, location, desireLevel, limit);
	    }

	    return applicants.stream()
	            .map(this::convertToDTO)
	            .collect(Collectors.toList());
	}
}
