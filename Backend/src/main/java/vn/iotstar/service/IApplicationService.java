package vn.iotstar.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import vn.iotstar.dto.NewApplicantResponseDTO;
import vn.iotstar.dto.applicant.ApplyRequestDTO;
import vn.iotstar.entity.Application;

public interface IApplicationService {

	Application apply(MultipartFile cvFile, ApplyRequestDTO dto, String username);
	
	List<NewApplicantResponseDTO> getNewApplicantsByRecruitmentNewsId(Integer recruitmentNewsId);
	
    void approveApplicant(Integer recruitmentNewsId, Integer applicantId);
    
    void rejectApplicant(Integer recruitmentNewsId, Integer applicantId);
}
