package vn.iotstar.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.iotstar.dto.InterviewMailRequestDTO;
import vn.iotstar.entity.Application;
import vn.iotstar.enums.EStatus;
import vn.iotstar.repository.IApplicationRepository;
import vn.iotstar.repository.IRecruitmentRepository;
import vn.iotstar.service.IInterviewService;

@Service
public class InterviewService implements IInterviewService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private IApplicationRepository applicationRepository;

  
    
    @Override
    public void sendInterviewEmail(InterviewMailRequestDTO request) {
        String subject = "📅 Lịch phỏng vấn - " + request.getCompanyName();

        String content = String.format(
            "Xin chào %s,\n\n" +
            "Chúng tôi là %s – cảm ơn bạn đã ứng tuyển vào vị trí việc làm của chúng tôi.\n\n" +
            "Bạn được mời tham dự buổi phỏng vấn:\n" +
            "📅 Ngày: %s\n" +
            "🕒 Giờ: %s\n" +
            "🧭 Hình thức: %s\n\n" +
            "Địa điểm/Link phỏng vấn: %s\n\n" +
            "Vui lòng phản hồi email này để xác nhận tham gia.\n\n" +
            "Trân trọng!\n" +
            "%s",
            request.getApplicantName(),
            request.getCompanyName(),
            request.getInterviewDate(),
            request.getInterviewTime(),
            request.getInterviewType(),
            request.getNote(),
            request.getCompanyName()
        );

        emailService.sendSimpleEmail(request.getEmail(), subject, content);
    }

    @Override
    @Transactional
    public void approveAndScheduleInterview(InterviewMailRequestDTO request) {
     
        applicationRepository.updateApplicationStatus(
            request.getRecruitmentNewsId(),
            request.getApplicantId(),
            EStatus.APPROVED
        );

        sendInterviewEmail(request);
    }
}