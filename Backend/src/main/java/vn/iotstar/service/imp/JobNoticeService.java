package vn.iotstar.service.imp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.dto.applicant.notice.CreateNoticeRequestDTO;
import vn.iotstar.dto.applicant.notice.EmailData;
import vn.iotstar.dto.applicant.notice.JobNoticeDTO;
import vn.iotstar.entity.Applicant;
import vn.iotstar.entity.JobNotice;
import vn.iotstar.entity.NoticeHistory;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.enums.EFrequency;
import vn.iotstar.repository.IJobNoticeRepository;
import vn.iotstar.service.EmailService;
import vn.iotstar.service.IApplicantService;
import vn.iotstar.service.IJobNoticeService;
import vn.iotstar.service.INoticeHistoryService;
import vn.iotstar.service.IRecruitmentService;

@Service
public class JobNoticeService implements IJobNoticeService {

	private final RecruitmentService recruitmentService;
	@Autowired
	private IApplicantService applicantService;

	@Autowired
	private IJobNoticeRepository jobNoticeRepository;

	@Autowired
	private IRecruitmentService rService;

//	@Autowired
//	private IJobNoticeRepository noticeRepository;
//	

	@Autowired
	private EmailService emailService;

	@Autowired
	private INoticeHistoryService historyService;

	JobNoticeService(RecruitmentService recruitmentService) {
		this.recruitmentService = recruitmentService;
	}

	@Override
	public List<JobNotice> findByApplicant_ApplicantIDAndIsActiveTrue(Integer applicantID) {
		return jobNoticeRepository.findByApplicant_ApplicantIDAndIsActiveTrue(applicantID);
	}

	@Override
	public List<JobNotice> findNoticeDueForSending(EFrequency frequency, LocalDate cutoffDate) {
		return jobNoticeRepository.findNoticeDueForSending(frequency, cutoffDate);
	}

	@Override
	public Optional<JobNotice> findById(Integer id) {
		return jobNoticeRepository.findById(id);
	}

	@Override
	public JobNoticeDTO createNotification(Integer applicantID, CreateNoticeRequestDTO request) {
		Applicant applicant = applicantService.findById(applicantID)
				.orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

		JobNotice notification = new JobNotice();
		notification.setApplicant(applicant);
		notification.setJobTitle(request.getJobTitle());

		notification.setLocation(request.getLocation());
		notification.setSalary(request.getSalary());
		notification.setLevel(request.getLevel());

		notification.setFrequency(EFrequency.valueOf(request.getFrequency().toUpperCase()));
//		notification.setEmailEnabled(request.getEmailEnabled());
//		notification.setWebEnabled(request.getWebEnabled());
		notification.setCreatedDate(LocalDateTime.now());
		notification.setIsActive(true);

		notification = jobNoticeRepository.save(notification);

		return convertToDTO(notification);
	}

	@Override
	public JobNoticeDTO convertToDTO(JobNotice notification) {
		JobNoticeDTO dto = new JobNoticeDTO();
		dto.setId(notification.getNoticeID());
		dto.setTitle(notification.getJobTitle());

//		dto.setRn(notification.getRn());
		dto.setLocation(notification.getLocation());
		dto.setSalary(notification.getSalary());
		dto.setLevel(notification.getLevel());
		dto.setFrequency(notification.getFrequency().getCode());
//		dto.setEmailEnabled(notification.getEmailEnabled());
//		dto.setWebEnabled(notification.getWebEnabled());
		dto.setCreatedDate(notification.getCreatedDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
		dto.setMatchingJobs(getMatchingJobsCount(notification.getNoticeID()));

		return dto;
	}

	@Override
	public Integer getMatchingJobsCount(Integer noticeID) {
		JobNotice notification = jobNoticeRepository.findById(noticeID)
				.orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

		return findMatchingJobs(notification).size();
	}

	private List<RecruitmentCardDTO> findMatchingJobs(JobNotice notification) {
		return rService
				.findMatchingJobs(notification.getJobTitle(), notification.getLocation(), notification.getSalary(),
						notification.getLevel(), notification.getLastSentDate())
				.stream().map(rService::mapToDetail).toList();
	}

//	public void sendEmailNotification(JobNotice notification, Applicant applicant, List<RecruitmentCardDTO> jobs) {
//		System.out.println("Sending email for JobNotice ID: " + notification.getNoticeID());
//		try {
//			String keyword = notification.getJobTitle() != null && !notification.getJobTitle().isEmpty()
//					? notification.getJobTitle()
//					: "công việc phù hợp";
//			jobs = findMatchingJobs(notification);
//			EmailData emailData = new EmailData();
//			emailData.setApplicantName(applicant.getApplicantName());
//			emailData.setKeyword(keyword);
//			emailData.setJobCount(jobs.size());
//			emailData.setJobs(jobs.subList(0, Math.min(20, jobs.size()))); // Limit to 20 jobs
//
//			emailService.sendJobNotificationEmail(applicant.getAccount().getEmail(), emailData);
//			System.out.println("Email sent to: " + applicant.getAccount().getEmail());
//		} catch (Exception e) {
//			System.err.println("Error sending email for JobNotice ID: " + notification.getNoticeID());
//			e.printStackTrace();
//		}
//	}
	@Override
	public void sendEmailNotification(JobNotice notification, Applicant applicant, List<RecruitmentCardDTO> jobs) {
		String keyword = notification.getJobTitle() != null && !notification.getJobTitle().isEmpty()
				? notification.getJobTitle()
				: "công việc phù hợp";
		jobs = findMatchingJobs(notification);
		EmailData emailData = new EmailData();
		emailData.setApplicantName(applicant.getApplicantName());
		emailData.setKeyword(keyword);
		emailData.setJobCount(jobs.size());
		emailData.setJobs(jobs.subList(0, Math.min(20, jobs.size())));

		emailService.sendJobNotificationEmail(applicant.getAccount().getEmail(), emailData);

	}

	private void sendNotifications(List<JobNotice> notifications) {
		for (JobNotice notification : notifications) {
			try {
				List<RecruitmentCardDTO> matchingJobs = findMatchingJobs(notification);

				Applicant applicant = notification.getApplicant();

				if (applicant.getAccount().getEmail() != null) {
					sendEmailNotification(notification, applicant, matchingJobs);
				}

				notification.setLastSentDate(LocalDate.now());
				jobNoticeRepository.save(notification);

				saveNotificationHistory(notification, matchingJobs.size());

			} catch (Exception e) {
				e.printStackTrace();
				saveNotificationHistory(notification, 0);
			}
		}
	}

	private void saveNotificationHistory(JobNotice notification, Integer jobCount) {
		NoticeHistory history = new NoticeHistory();
		history.setNotice(notification);
		history.setApplicant(notification.getApplicant());
		history.setJobCount(jobCount);
		history.setSentDate(LocalDateTime.now());
//		history.setStatus(status);
//		history.setErrorMessage(errorMessage);

//		DeliveryType deliveryType;
//		if (notification.getEmailEnabled() && notification.getWebEnabled()) {
//			deliveryType = DeliveryType.BOTH;
//		} else if (notification.getEmailEnabled()) {
//			deliveryType = DeliveryType.EMAIL;
//		} else {
//			deliveryType = DeliveryType.WEB;
//		}
//		history.setDeliveryType(deliveryType);

		historyService.save(history);
	}

	@Transactional
	public void sendScheduledNotifications() {

		LocalDate now = LocalDate.now();

		List<JobNotice> dailyNotifications = jobNoticeRepository.findNoticeDueForSending(EFrequency.DAILY,
				now.minusDays(1));
		sendNotifications(dailyNotifications);

		List<JobNotice> weeklyNotifications = jobNoticeRepository.findNoticeDueForSending(EFrequency.WEEKLY,
				now.minusWeeks(1));
		sendNotifications(weeklyNotifications);

		List<JobNotice> monthlyNotifications = jobNoticeRepository.findNoticeDueForSending(EFrequency.MONTHLY,
				now.minusMonths(1));
		sendNotifications(monthlyNotifications);

	}

	@Override
	public JobNoticeDTO updateNotice(Integer noticeID, CreateNoticeRequestDTO request) {
		JobNotice notification = jobNoticeRepository.findById(noticeID)
				.orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

		notification.setJobTitle(request.getJobTitle());
		notification.setLocation(request.getLocation());
		notification.setSalary(request.getSalary());
		notification.setLevel(request.getLevel());
		notification.setFrequency(EFrequency.valueOf(request.getFrequency().toUpperCase()));
//		notification.setEmailEnabled(request.getEmailEnabled());
//		notification.setWebEnabled(request.getWebEnabled());

		notification = jobNoticeRepository.save(notification);

		return convertToDTO(notification);
	}

	@Override
	@Transactional
	public void deleteNotice(Integer noticeID) {
		JobNotice notification = jobNoticeRepository.findById(noticeID)
				.orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

		notification.setIsActive(false);
		jobNoticeRepository.save(notification);
	}

}
