package vn.iotstar.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import vn.iotstar.dto.applicant.ApplyRequestDTO;
import vn.iotstar.dto.applicant.ProfileDTO;
import vn.iotstar.dto.ApplicantDTO; 
import vn.iotstar.dto.ApplicantSearchDTO;
import vn.iotstar.dto.ApplicantDetailDTO;
import vn.iotstar.entity.Account;
import vn.iotstar.entity.Applicant;

public interface IApplicantService {

    long count();

    <S extends Applicant> S save(S entity);

    String storeFile(MultipartFile file); 

    Applicant findByAccount_accountID(Integer accountId);
    
    Optional<ApplicantDetailDTO> getApplicantDetailById(Integer applicantId);

    Page<ApplicantDTO> searchAndFilterApplicants(ApplicantSearchDTO searchDTO);

	Applicant findByAccount_email(String email);

	// ApplicantDTO convertToDTO(Applicant applicant);

	ProfileDTO updateApplicant(Integer applicantID, ProfileDTO profileDTO);


	void deleteFile(String fileName);

	Optional<Applicant> findById(Integer id);

	// ApplicantDetailDTO convertToDetailDTO(Applicant applicant);

	ProfileDTO mapToDetail(Applicant applicant);

    
}
