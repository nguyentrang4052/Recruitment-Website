package vn.iotstar.service.imp;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DecimalFormat; 
import java.util.*;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import vn.iotstar.dto.ApplicantDTO;
import vn.iotstar.dto.ApplicantSearchDTO;
import vn.iotstar.dto.ApplicantDetailDTO; 
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.CareerInformation;
import vn.iotstar.entity.Skill;
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


    private ApplicantDTO convertToDTO(Applicant applicant) {
        ApplicantDTO dto = new ApplicantDTO();
        dto.setApplicantID(applicant.getApplicantID());
        dto.setApplicantName(applicant.getApplicantName());
        dto.setBirthday(applicant.getBirthday());
        dto.setGender(applicant.getGender());
        dto.setAddress(applicant.getAddress());
        dto.setPhone(applicant.getPhone());
        dto.setGoal(applicant.getGoal());
        
        // Dùng desireLevel cho trường experience trong ApplicantDTO (cho Search)
        CareerInformation ciForSearch = applicant.getCareerInformation();
        if (ciForSearch != null && ciForSearch.getDesireLevel() != null) {
            dto.setExperience(ciForSearch.getDesireLevel());
        } else {
            dto.setExperience(applicant.getExperience());
        }
        
        dto.setLiteracy(applicant.getLiteracy());

        if (applicant.getAccount() != null) {
            dto.setEmail(applicant.getAccount().getEmail());
            dto.setPhoto(applicant.getAccount().getPhoto());
        }

        CareerInformation ci = applicant.getCareerInformation();
        if (ci != null) {
            dto.setJobTitle(ci.getTitle());
            dto.setDesireLevel(ci.getDesireLevel());
            dto.setFormOfWork(ci.getFormOfWork() != null ? ci.getFormOfWork().toString() : null);
            dto.setLocation(ci.getLocation());
            
            if (ci.getDesireSalary() != null) {
                DecimalFormat formatter = new DecimalFormat("#,### VND"); 
                dto.setDesireSalary(formatter.format(ci.getDesireSalary()));
            }
        }

        if (applicant.getSkill() != null) {
            List<String> skillNames = applicant.getSkill().stream()
                                            .map(Skill::getSkillName)
                                            .collect(Collectors.toList());
            dto.setSkillNames(skillNames);
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
        DecimalFormat formatter = new DecimalFormat("#,### VND"); 

        dto.setApplicantID(applicant.getApplicantID());
        dto.setApplicantName(applicant.getApplicantName());
        dto.setExperience(applicant.getExperience()); 
        dto.setPhone(applicant.getPhone());
        dto.setSummary(applicant.getGoal()); 
        
        dto.setLiteracy(applicant.getLiteracy());

        if (applicant.getAccount() != null) {
            dto.setEmail(applicant.getAccount().getEmail());
            dto.setPhoto(applicant.getAccount().getPhoto());
        }
        
        CareerInformation ci = applicant.getCareerInformation();
        if (ci != null) {
            dto.setJobTitle(ci.getTitle());
            dto.setLocation(ci.getLocation());
            
            dto.setLevel(ci.getDesireLevel()); 
            
            if (ci.getDesireSalary() != null) {
                dto.setDesireSalary(formatter.format(ci.getDesireSalary()));
            } else {
                dto.setDesireSalary("Thỏa thuận");
            }
        } else {
             dto.setDesireSalary("Thỏa thuận");
             dto.setLevel("Chưa rõ"); 
        }

        if (applicant.getSkill() != null) { 
            List<String> skillNames = applicant.getSkill().stream()
                                            .map(Skill::getSkillName)
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
                            ? searchDTO.getSearchTerm().trim() : null;
                            
        String location = searchDTO.getLocation() != null && !searchDTO.getLocation().trim().isEmpty() 
                            ? searchDTO.getLocation().trim() : null;
                            
      
        String desireLevel = searchDTO.getExperience() != null && !searchDTO.getExperience().trim().isEmpty() 
                            && !searchDTO.getExperience().equalsIgnoreCase("Tất cả")
                            ? searchDTO.getExperience().trim() : null; 

        List<String> skills = searchDTO.getSkills() != null && !searchDTO.getSkills().isEmpty() 
                                ? searchDTO.getSkills() : null;

        Long skillCount = skills != null ? (long) skills.size() : 0L; 
        
        Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize());
        
        Page<Applicant> applicantsPage;
        

        if (skills != null) {
            applicantsPage = applicantRepository.searchWithSkills(
                keyword, 
                location, 
                desireLevel, 
                skills,
                skillCount, 
                pageable
            );
        } else {
            applicantsPage = applicantRepository.searchWithoutSkills(
                keyword, 
                location, 
                desireLevel, 
                pageable
            );
        }

        return applicantsPage.map(this::convertToDTO);
    }
}