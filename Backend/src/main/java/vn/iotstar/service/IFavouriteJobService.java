package vn.iotstar.service;

import java.util.List;

import vn.iotstar.entity.FavouriteJob;
import vn.iotstar.entity.RecruitmentNews;

public interface IFavouriteJobService {

	List<FavouriteJob> findByApplicant_ApplicantID(Integer applicantID);

	void deleteByApplicant_ApplicantIDAndRecruitmentNews_RNID(Integer applicantID, Integer RNID);

	boolean existsByApplicant_ApplicantIDAndRecruitmentNews_RNID(Integer applicantID, Integer RNID);

	List<RecruitmentNews> getFavorites(Integer applicantID);

	String toggleFavorite(Integer applicantID, Integer rnid);

}
