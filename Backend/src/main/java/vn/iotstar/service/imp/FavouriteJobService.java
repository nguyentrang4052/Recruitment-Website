package vn.iotstar.service.imp;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.FavouriteJob;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.repository.IApplicantRepository;
import vn.iotstar.repository.IFavouriteJobRepository;
import vn.iotstar.service.IApplicantService;
import vn.iotstar.service.IFavouriteJobService;
import vn.iotstar.service.IRecruitmentService;

@Service
public class FavouriteJobService implements IFavouriteJobService{
	
	@Autowired
	private IFavouriteJobRepository fRepository;
	
	@Autowired
	private IApplicantService applicantService;
	
	@Autowired
	private IRecruitmentService rService;

	@Override
	public boolean existsByApplicant_ApplicantIDAndRecruitmentNews_RNID(Integer applicantID, Integer RNID) {
		return fRepository.existsByApplicant_ApplicantIDAndRecruitmentNews_RNID(applicantID, RNID);
	}

	@Override
	public void deleteByApplicant_ApplicantIDAndRecruitmentNews_RNID(Integer applicantID, Integer RNID) {
		fRepository.deleteByApplicant_ApplicantIDAndRecruitmentNews_RNID(applicantID, RNID);
	}

	@Override
	public List<FavouriteJob> findByApplicant_ApplicantID(Integer applicantID) {
		return fRepository.findByApplicant_ApplicantID(applicantID);
	}
	
	@Override
	@Transactional
	public String toggleFavorite(Integer applicantID, Integer rnid) {
        if (existsByApplicant_ApplicantIDAndRecruitmentNews_RNID(applicantID, rnid)) {
            deleteByApplicant_ApplicantIDAndRecruitmentNews_RNID(applicantID, rnid);
            return "Removed from favorites";
        }else {
        	Applicant applicant = applicantService.findById(applicantID)
                    .orElseThrow(() -> new RuntimeException("Applicant not found"));
            RecruitmentNews recruitment = rService.findById(rnid)
                    .orElseThrow(() -> new RuntimeException("Recruitment not found"));

            FavouriteJob favorite = new FavouriteJob();
            favorite.setApplicant(applicant);
            favorite.setRecruitmentNews(recruitment);
            fRepository.save(favorite);

            return "Added to favorites";
        }
        
    }
	
	 @Override
	public List<RecruitmentNews> getFavorites(Integer applicantID) {
	        List<FavouriteJob> favorites = fRepository.findByApplicant_ApplicantID(applicantID);
	        return favorites.stream()
	                .map(FavouriteJob::getRecruitmentNews)
	                .collect(Collectors.toList());
	    }

}
