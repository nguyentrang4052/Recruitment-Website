package vn.iotstar.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

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
    
    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("gzconnect.team@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
