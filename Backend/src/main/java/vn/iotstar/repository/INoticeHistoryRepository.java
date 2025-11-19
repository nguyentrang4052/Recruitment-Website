package vn.iotstar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.iotstar.entity.NoticeHistory;

@Repository
public interface INoticeHistoryRepository extends JpaRepository<NoticeHistory, Integer> {
	 List<NoticeHistory> findByApplicant_ApplicantIDOrderBySentDateDesc(Integer applicantID);
}
