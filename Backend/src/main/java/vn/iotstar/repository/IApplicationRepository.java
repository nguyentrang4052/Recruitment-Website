package vn.iotstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.Application;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.key.ApplicationID;

@Repository
public interface IApplicationRepository extends JpaRepository<Application, ApplicationID>{
	boolean existsByApplicantAndRecruitmentNews(Applicant applicant, RecruitmentNews reNews);
	
	Application findByApplicant_ApplicantIDAndRecruitmentNews_RNID(Integer applicantID, Integer RNID);
}
