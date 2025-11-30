package vn.iotstar.service;

import java.util.List;

import vn.iotstar.entity.SaveJob;
import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.entity.RecruitmentNews;

public interface ISaveJobService {

	List<SaveJob> findByApplicant_ApplicantID(Integer applicantID);

	void deleteByApplicant_ApplicantIDAndRecruitmentNews_RNID(Integer applicantID, Integer RNID);

	boolean existsByApplicant_ApplicantIDAndRecruitmentNews_RNID(Integer applicantID, Integer RNID);

	List<RecruitmentCardDTO> getFavorites(Integer applicantID);

	String toggleFavorite(Integer applicantID, Integer rnid);

}
