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

	// @Override
	// public ApplicantDTO convertToDTO(Applicant applicant) {
	// 	ApplicantDTO dto = new ApplicantDTO();
	// 	dto.setApplicantID(applicant.getApplicantID());
	// 	dto.setApplicantName(applicant.getApplicantName());
	// 	dto.setBirthday(applicant.getBirthday());
	// 	dto.setGender(applicant.getGender());
	// 	dto.setAddress(applicant.getAddress());
	// 	dto.setPhone(applicant.getPhone());
	// 	dto.setGoal(applicant.getGoal());
	// 	CareerInformation ciForSearch = applicant.getCareerInformation();
	// 	if (ciForSearch != null && ciForSearch.getDesireLevel() != null) {
	// 		dto.setExperience(ciForSearch.getDesireLevel());
	// 	} else {
	// 		dto.setExperience(applicant.getExperience());
	// 	}

//    private ApplicantDTO convertToDTO(Applicant applicant) {
//        ApplicantDTO dto = new ApplicantDTO();
//        dto.setApplicantID(applicant.getApplicantID());
//        dto.setApplicantName(applicant.getApplicantName());
//        dto.setBirthday(applicant.getBirthday());
//        dto.setGender(applicant.getGender());
//        dto.setAddress(applicant.getAddress());
//        dto.setPhone(applicant.getPhone());
//        dto.setGoal(applicant.getGoal());
//        
//        // Dùng desireLevel cho trường experience trong ApplicantDTO (cho Search)
//        CareerInformation ciForSearch = applicant.getCareerInformation();
//        if (ciForSearch != null && ciForSearch.getDesireLevel() != null) {
//            dto.setExperience(ciForSearch.getDesireLevel());
//        } else {
//            dto.setExperience(applicant.getExperience());
//        }
//        
//        dto.setLiteracy(applicant.getLiteracy());
//
//        if (applicant.getAccount() != null) {
//            dto.setEmail(applicant.getAccount().getEmail());
//            dto.setPhoto(applicant.getAccount().getPhoto());
//        }
//
//        CareerInformation ci = applicant.getCareerInformation();
//        if (ci != null) {
//            dto.setJobTitle(ci.getTitle());
//            dto.setDesireLevel(ci.getDesireLevel());
//            dto.setFormOfWork(ci.getFormOfWork() != null ? ci.getFormOfWork().toString() : null);
//            dto.setLocation(ci.getLocation());
//            
//            if (ci.getDesireSalary() != null) {
//                DecimalFormat formatter = new DecimalFormat("#,### VND"); 
//                dto.setDesireSalary(formatter.format(ci.getDesireSalary()));
//            }
//        }
//
//        if (applicant.getSkill() != null) {
//            List<String> skillNames = applicant.getSkill().stream()
//                                            .map(Skill::getSkillName)
//                                            .collect(Collectors.toList());
//            dto.setSkillNames(skillNames);
//        }
//
//        return dto;
//    }


//   @Override
//    @Transactional(readOnly = true)
//    public Optional<ApplicantDetailDTO> getApplicantDetailById(Integer applicantID) {
//        return applicantRepository.findByApplicantID(applicantID)
//                .map(this::convertToDetailDTO);
//    }
//    
//
//    private ApplicantDetailDTO convertToDetailDTO(Applicant applicant) {
//        ApplicantDetailDTO dto = new ApplicantDetailDTO();
//        DecimalFormat formatter = new DecimalFormat("#,### VND"); 
//
//        dto.setApplicantID(applicant.getApplicantID());
//        dto.setApplicantName(applicant.getApplicantName());
//        dto.setExperience(applicant.getExperience()); 
//        dto.setPhone(applicant.getPhone());
//        dto.setSummary(applicant.getGoal()); 
//        
//        dto.setLiteracy(applicant.getLiteracy());
//
//        if (applicant.getAccount() != null) {
//            dto.setEmail(applicant.getAccount().getEmail());
//            dto.setPhoto(applicant.getAccount().getPhoto());
//        }
//        
//        CareerInformation ci = applicant.getCareerInformation();
//        if (ci != null) {
//            dto.setJobTitle(ci.getTitle());
//            dto.setLocation(ci.getLocation());
//            
//            dto.setLevel(ci.getDesireLevel()); 
//            
//            if (ci.getDesireSalary() != null) {
//                dto.setDesireSalary(formatter.format(ci.getDesireSalary()));
//            } else {
//                dto.setDesireSalary("Thỏa thuận");
//            }
//        } else {
//             dto.setDesireSalary("Thỏa thuận");
//             dto.setLevel("Chưa rõ"); 
//        }
//
//        if (applicant.getSkill() != null) { 
//            List<String> skillNames = applicant.getSkill().stream()
//                                            .map(Skill::getSkillName)
//                                            .collect(Collectors.toList());
//            dto.setSkillNames(skillNames);
//        } else {
//             dto.setSkillNames(Collections.emptyList());
//        }
//       
//
//        return dto;
//    }


    // @Override
    // @Transactional(readOnly = true)
    // public Page<ApplicantDTO> searchAndFilterApplicants(ApplicantSearchDTO searchDTO) {
        
    //     String keyword = (searchDTO.getSearchTerm() == null || searchDTO.getSearchTerm().trim().isEmpty()) 
    //                         ? null : searchDTO.getSearchTerm().trim();
                            
    //     String location = (searchDTO.getLocation() == null || searchDTO.getLocation().trim().isEmpty()) 
    //                         ? null : searchDTO.getLocation().trim();
                            
    //     String desireLevel = (searchDTO.getExperience() == null || searchDTO.getExperience().trim().isEmpty() 
    //                         || "Tất cả".equalsIgnoreCase(searchDTO.getExperience())) 
    //                         ? null : searchDTO.getExperience().trim();

    //     List<String> skills = (searchDTO.getSkills() == null || searchDTO.getSkills().isEmpty()) 
    //                             ? null : searchDTO.getSkills();
                                
    //     Long skillCount = skills != null ? (long) skills.size() : 0L;
        
    //     Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize());
        
    //     Page<Applicant> applicantsPage;
    //     if (skills == null || skills.isEmpty()) {
    //         applicantsPage = applicantRepository.searchWithoutSkills(keyword, location, desireLevel, pageable);
    //     } else {
    //         applicantsPage = applicantRepository.searchWithSkills(keyword, location, desireLevel, skills, skillCount, pageable);
    //     }

    //     return applicantsPage.map(this::convertToDTO);
    // }
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


    @Override
    @Transactional(readOnly = true)
    public Optional<ApplicantDetailDTO> getApplicantDetailById(Integer applicantID) {
        return applicantRepository.findByApplicantID(applicantID)
                .map(this::convertToDetailDTO);
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
		copyNonNull(profileDTO, existingApplicant.getAccount(), "photo");
		copyNonNull(profileDTO, existingApplicant.getCareerInformation(), "title", "desireLevel", "formOfWork",
				"location");
		copyNonNull(profileDTO, existingApplicant, "applicantName", "phone", "address", "birthday", "goal",
				"experience", "literacy", "skills");
		if (profileDTO.getSkills() != null)
			existingApplicant.setSkill(profileDTO.getSkills());
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

	@Override
	public ProfileDTO mapToDetail(Applicant applicant) {

		List<Skill> skill = applicant.getSkill();

		return new ProfileDTO(applicant.getApplicantID(),applicant.getAccount().getPhoto(), applicant.getAccount().getEmail(), applicant.getApplicantName(), applicant.getPhone(),
				applicant.getAddress(), applicant.getBirthday(), applicant.getGoal(), applicant.getExperience(),
				applicant.getLiteracy(), skill, applicant.getCareerInformation().getTitle(),
				applicant.getCareerInformation().getDesireLevel(), applicant.getCareerInformation().getDesireSalary(),
				applicant.getCareerInformation().getFormOfWork(), applicant.getCareerInformation().getLocation());
	}

}
