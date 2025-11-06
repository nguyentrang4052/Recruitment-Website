package vn.iotstar.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	@Value("${jwt.secret}")
	private String SECRET_KEY;

	private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

	private Key getSigningKey() {
		return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
	}

//	public String generateToken(String username) {
//		String jti = UUID.randomUUID().toString();
//		return Jwts.builder().setSubject(username).setId(jti).setIssuedAt(new Date(System.currentTimeMillis()))
//				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))					
//				.signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
//	}

	public String generateToken(String username, String provider) {
		String jti = UUID.randomUUID().toString();
		return Jwts.builder().setSubject(username).setId(jti).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)).claim("provider", provider)
				.signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
	}

	public String extractUsername(String token) {
		return extractClaims(token).getSubject();
	}

	public String extractProvider(String token) {
		return (String) extractClaims(token).get("provider"); 
	}

	public boolean validateToken(String token, UserDetails userDetails) {
		 try {
	            final String username = extractUsername(token); 
	            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
	        } catch (JwtException e) {
	            return false;
	        }
	}

	public Date getExpiration(String token) {
		return extractClaims(token).getExpiration();
	}

	public Claims extractJti(String token) {
		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
	}

	private boolean isTokenExpired(String token) {
		return extractClaims(token).getExpiration().before(new Date());
	}

	private Claims extractClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
	}

}