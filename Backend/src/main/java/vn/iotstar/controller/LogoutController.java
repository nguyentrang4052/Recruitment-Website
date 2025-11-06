package vn.iotstar.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;
import vn.iotstar.security.JwtUtil;
import vn.iotstar.util.SecurityUtil;

@Controller
@RequestMapping("/api")
public class LogoutController {
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private SecurityUtil securityUtil;
	@Autowired
	private RedisTemplate<String, String> redisTemplate;

	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			return ResponseEntity.badRequest().body("Missing or invalid Authorization header");
		}

		String token = authHeader.substring(7);

		try {
			long now = System.currentTimeMillis();
			long exp = jwtUtil.getExpiration(token).getTime();
			long ttl = (exp - now) / 1000;

			if (ttl > 0) {
				securityUtil.blacklistToken(token, ttl);
				return ResponseEntity.ok("Đăng xuất thành công.");
			} else {
				return ResponseEntity.ok("Token đã hết hạn.");
			}

		} catch (Exception e) {
			return ResponseEntity.status(500).body("Token không hợp lệ.");
		}
	}


}
