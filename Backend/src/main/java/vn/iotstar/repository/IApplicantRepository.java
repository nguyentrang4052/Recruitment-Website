package vn.iotstar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.RecruitmentNews;

@Repository
public interface IApplicantRepository extends JpaRepository<Applicant, Integer>{
	Applicant findByAccount_accountID(Integer accountId);
	
	
}
