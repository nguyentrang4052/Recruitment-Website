package vn.iotstar.service;

import java.util.List;
import java.util.Optional;

import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.entity.RecruitmentNews;

public interface IRecruitmentService {

	List<RecruitmentNews> findAll();

	Optional<RecruitmentNews> findById(Integer id);

	RecruitmentCardDTO mapToDetail(RecruitmentNews rn);

	List<RecruitmentNews> getRelateJob(Integer id);

	Integer countApprovedJobs(Integer id);

	List<RecruitmentNews> findByEmployer_EmployerID(Integer id);

}
