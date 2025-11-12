package vn.iotstar.service;

import org.springframework.web.multipart.MultipartFile;

import vn.iotstar.dto.applicant.ApplyRequestDTO;
import vn.iotstar.entity.Application;

public interface IApplicationService {

	Application apply(MultipartFile cvFile, ApplyRequestDTO dto, String username);

	Application findByApplicant_ApplicantIDAndRecruitmentNews_RNID(Integer applicantID, Integer RNID);

}
