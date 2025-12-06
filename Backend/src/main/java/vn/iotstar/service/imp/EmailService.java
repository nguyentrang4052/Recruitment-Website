package vn.iotstar.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import vn.iotstar.dto.applicant.notice.EmailData;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.util.FormatSalary;
import vn.iotstar.util.UrlUtil;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender mailSender;

	@Value("${app.base-url}")
	private String baseUrl;

	@Value("${app.backend-url}")
	private String backendUrl;

	public void sendVerificationEmail(String toEmail, String token) {
		String link = "http://localhost:8080/api/employer/register/verify?token=" + token;
		String subject = "Xác thực email đăng ký";
		String content = "Vui lòng click vào link sau để xác thực đăng nhập tài khoản:\n" + link;

		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("gzconnect.team@gmail.com");
		message.setTo(toEmail);
		message.setSubject(subject);
		message.setText(content);

		mailSender.send(message);
	}

	@Autowired
	private TemplateEngine templateEngine;

	public void sendVerificationApply(String toEmail, RecruitmentNews rn) {
		try {
			Context context = new Context();
			context.setVariable("companyName", rn.getEmployer().getEmployerName());
			context.setVariable("position", rn.getPosition());
			context.setVariable("rnid", rn.getRNID());
			context.setVariable("baseUrl", baseUrl);

			String htmlContent = templateEngine.process("email/application-confirmation", context);

			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setFrom("gzconnect.team@gmail.com");
			helper.setTo(toEmail);
			helper.setSubject("Xác nhận ứng tuyển - " + rn.getPosition());
			helper.setText(htmlContent, true);

			mailSender.send(message);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

	public void sendJobNotificationEmail(String to, EmailData data) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setFrom("gzconnect.team@gmail.com");

			helper.setTo(to);
			helper.setSubject("Có " + data.getJobCount() + " việc làm mới phù hợp với bạn");

			data.getJobs().forEach(job -> {

				if (job.getEmployer() != null && job.getEmployer().getLogo() != null) {
					String logo = job.getEmployer().getLogo();
					logo = UrlUtil.replaceLocalhost(logo, backendUrl);
					job.getEmployer().setLogo(logo);
				}

				if (job.getSalary() != null) {
					String formattedSalary = FormatSalary.formatRangeShort(job.getSalary());
					job.setSalary(formattedSalary);
				}

			});

			Context context = new Context();
			context.setVariable("candidateName", data.getApplicantName());
			context.setVariable("keyword", data.getKeyword());
			context.setVariable("jobCount", data.getJobCount());
			context.setVariable("jobs", data.getJobs());
			context.setVariable("backendUrl", backendUrl);
			context.setVariable("baseUrl", baseUrl);

			String htmlContent = templateEngine.process("email/notice", context);
			helper.setText(htmlContent, true);

			mailSender.send(message);

		} catch (MessagingException e) {
			throw new RuntimeException("Failed to send email", e);
		}

	}

	public void sendSimpleEmail(String to, String subject, String text) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("gzconnect.team@gmail.com");
		message.setTo(to);
		message.setSubject(subject);
		message.setText(text);
		mailSender.send(message);
	}

}
