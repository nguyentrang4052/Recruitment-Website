package vn.iotstar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.iotstar.entity.SaveJob;

@Repository
public interface ISaveJobRepository extends JpaRepository<SaveJob, Integer>{
	boolean existsByApplicant_ApplicantIDAndRecruitmentNews_RNID(Integer applicantID, Integer RNID);
    void deleteByApplicant_ApplicantIDAndRecruitmentNews_RNID(Integer applicantID, Integer RNID);
    List<SaveJob> findByApplicant_ApplicantID(Integer applicantID);
}
