package vn.iotstar.security;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import vn.iotstar.service.EmailService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final EmailService emailService;
	@Autowired
	private CustomUserDetailsService userDetailsService;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private RedisTemplate<String, String> redisTemplate;

    JwtFilter(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        if (path.equals("/api/logout") || path.equals("/api/") || path.equals("/api/detail")
                || path.equals("/api/applicant/relate-jobs") || path.equals("/api/applicant/companies")
                || path.equals("/api/applicant/companies/detail") || path.equals("/api/applicant/companies/job") || path.equals("/api/job/search")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String username;
        String provider;
        String jti;

        try {
            jti = jwtUtil.extractJti(token).getId();
            username = jwtUtil.extractUsername(token);
            provider = jwtUtil.extractProvider(token);
        } catch (ExpiredJwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token expired");
            return;
        } catch (JwtException | IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token");
            return;
        }


        if (Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + jti))) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token revoked");
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UsernamePasswordAuthenticationToken authToken;

            if ("google".equalsIgnoreCase(provider)) {
                authToken = new UsernamePasswordAuthenticationToken(username, null, List.of());
            } else {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

 
                if (!jwtUtil.validateToken(token, userDetails)) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token hết hạn hoặc không hợp lệ");
                    return;
                }


                String expectedProvider = ((CustomUserDetail) userDetails).getAccount().getProvider();
                if (!provider.equalsIgnoreCase(expectedProvider)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Invalid token");
                    return;
                }

                String role = ((CustomUserDetail) userDetails).getAccount().getRole().getRoleName();
                
                var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
                authToken = new UsernamePasswordAuthenticationToken(username, null,authorities);
                if ("google".equalsIgnoreCase(provider)) {
                    authToken = new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
                }

            }

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }



    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/")
                || path.startsWith("/api/employer/register")
                || path.startsWith("/api/skills/list");
    }

    // @Override
    // protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
    //         throws ServletException, IOException {

    //     String authHeader = request.getHeader("Authorization");
    //     String username = null;
    //     String token = null;

    //     if (authHeader != null && authHeader.startsWith("Bearer ")) {
    //         token = authHeader.substring(7);
    //         try {
    //             username = jwtUtil.extractUsername(token);
    //         } catch (Exception e) {
    //             response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token không hợp lệ");
    //             return;
    //         }
    //     }

    //     if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
    //         CustomUserDetail userDetails = (CustomUserDetail) userDetailsService.loadUserByUsername(username);

    //         if (jwtUtil.validateToken(token, userDetails)) {

    //             String role = userDetails.getAccount().getRole().getRoleName(); 
    //             var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

    //             var authToken = new UsernamePasswordAuthenticationToken(
    //                     userDetails, null, authorities
    //             );
    //             authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    //             SecurityContextHolder.getContext().setAuthentication(authToken);
    //         } else {
    //             response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token hết hạn hoặc không hợp lệ");
    //             return;
    //         }
    //     }

    //     filterChain.doFilter(request, response);
    // }

}
