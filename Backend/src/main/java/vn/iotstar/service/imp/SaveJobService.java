package vn.iotstar.service.imp;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.SaveJob;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.repository.IApplicantRepository;
import vn.iotstar.repository.ISaveJobRepository;
import vn.iotstar.service.IApplicantService;
import vn.iotstar.service.ISaveJobService;
import vn.iotstar.service.IRecruitmentService;

@Service
public class SaveJobService implements ISaveJobService{
	
	@Autowired
	private ISaveJobRepository fRepository;
	
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
	public List<SaveJob> findByApplicant_ApplicantID(Integer applicantID) {
		return fRepository.findByApplicant_ApplicantID(applicantID);
	}
	
	@Override
	@Transactional
	public String toggleFavorite(Integer applicantID, Integer rnid) {
        if (existsByApplicant_ApplicantIDAndRecruitmentNews_RNID(applicantID, rnid)) {
            deleteByApplicant_ApplicantIDAndRecruitmentNews_RNID(applicantID, rnid);
            return "Bỏ lưu";
        }else {
        	Applicant applicant = applicantService.findById(applicantID)
                    .orElseThrow(() -> new RuntimeException("Ứng viên không tồn tại."));
            RecruitmentNews recruitment = rService.findById(rnid)
                    .orElseThrow(() -> new RuntimeException("Tin tuyển dụng không tồn tại."));

            SaveJob favorite = new SaveJob();
            favorite.setApplicant(applicant);
            favorite.setRecruitmentNews(recruitment);
            fRepository.save(favorite);

            return "Đã lưu.";
        }
        
    }
	
	 @Override
	public List<RecruitmentCardDTO> getFavorites(Integer applicantID) {
	        List<SaveJob> favorites = fRepository.findByApplicant_ApplicantID(applicantID);
//	        return favorites.stream()
//	                .map(SaveJob::getRecruitmentNews)
//	                .collect(Collectors.toList());
	        return favorites.stream().map(fav -> {
	            RecruitmentNews rn = fav.getRecruitmentNews();

	            RecruitmentCardDTO dto = rService.mapToDetail(rn);

	            // thêm createdAt vào DTO
	            dto.setSaveJob(fav.getCreatedAt()); 

	            return dto;
	        }).collect(Collectors.toList());
	    }

}
