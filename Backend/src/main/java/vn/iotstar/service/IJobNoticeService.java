package vn.iotstar.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.dto.applicant.notice.CreateNoticeRequestDTO;
import vn.iotstar.dto.applicant.notice.JobNoticeDTO;
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.JobNotice;
import vn.iotstar.enums.EFrequency;

public interface IJobNoticeService {

	Integer getMatchingJobsCount(Integer noticeID);

	JobNoticeDTO createNotification(Integer applicantID, CreateNoticeRequestDTO request);

	Optional<JobNotice> findById(Integer id);

	List<JobNotice> findNoticeDueForSending(EFrequency frequency, LocalDate cutoffDate);

	List<JobNotice> findByApplicant_ApplicantIDAndIsActiveTrue(Integer applicantID);

	void sendEmailNotification(JobNotice notification, Applicant applicant, List<RecruitmentCardDTO> jobs);

	void deleteNotice(Integer noticeID);

	JobNoticeDTO updateNotice(Integer noticeID, CreateNoticeRequestDTO request);

	JobNoticeDTO convertToDTO(JobNotice notification);

}
