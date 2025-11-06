package vn.iotstar.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import vn.iotstar.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import java.time.Duration;
import java.util.Random;

@Component
public class SecurityUtil {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JavaMailSender mailSender;

    private static final long OTP_TTL_MINUTES = 5;
    private static final long SIGNUP_DATA_TTL_MINUTES = 10;

    public String generateOtp() {
        return String.valueOf(new Random().nextInt(899999) + 100000);
    }

    public boolean sendOtp(String email) {
        String otp = generateOtp();
        redisTemplate.opsForValue().set("OTP:" + email, otp, Duration.ofMinutes(OTP_TTL_MINUTES));
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your OTP Code");
            message.setText("Your OTP is: " + otp);
            mailSender.send(message);
            System.out.println("OTP sent to " + email);
            return true;
        } catch (Exception e) {
            System.out.println("Error sending OTP to " + email);
            e.printStackTrace();
            return false;
        }
    }

    public boolean verifyOtp(String email, String inputOtp) {
        String savedOtp = redisTemplate.opsForValue().get("OTP:" + email);
        return inputOtp != null && inputOtp.equals(savedOtp);
    }

    public void saveSignupRequestToRedis(String email, Object signupRequestDTO) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String jsonData = mapper.writeValueAsString(signupRequestDTO);
            redisTemplate.opsForValue().set("SIGNUP:" + email, jsonData, Duration.ofMinutes(SIGNUP_DATA_TTL_MINUTES));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    public String getSignupDataFromRedis(String email) {
        return redisTemplate.opsForValue().get("SIGNUP:" + email);
    }

    public void deleteSignupData(String email) {
        redisTemplate.delete("SIGNUP:" + email);
        redisTemplate.delete("OTP:" + email);
    }
    
    public void blacklistToken(String token, long ttlInSeconds) {
        String jti = jwtUtil.extractJti(token).getId();
        redisTemplate.opsForValue().set("blacklist:" + jti, "blacklisted", Duration.ofSeconds(ttlInSeconds));
    }

    public boolean isTokenBlacklisted(String token) {
    	String jti = jwtUtil.extractJti(token).getId();
        return redisTemplate.hasKey("blacklist:" + jti);

    }
}
