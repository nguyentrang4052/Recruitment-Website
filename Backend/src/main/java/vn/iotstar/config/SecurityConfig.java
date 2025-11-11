package vn.iotstar.config;

import java.io.IOException;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;	
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;

import vn.iotstar.security.CustomUserDetailsService;
import vn.iotstar.security.JwtFilter;

@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authManager, JwtFilter jwtFilter)
			throws Exception {
		http.cors(cors -> cors.configurationSource(corsConfigurationSource())).csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(auth -> auth.requestMatchers("/api/auth/**", "/uploads/**", "/api/skills/list", "/api/employer/uploadLogo", "/api/employer/register",  "/api/employer/register/verify**").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/", "/api/detail", "/api/applicant/relate-jobs",
								"/api/applicant/companies", "/api/applicant/companies/detail", "/api/applicant/companies/job", "/api/job/search").permitAll()
//						.requestMatchers(HttpMethod.GET, "/api/applicant/favourite-job").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/employer/recruitment/create").hasAuthority("ROLE_employer")
//						.requestMatchers(HttpMethod.POST, "/api/applicant/toggle").hasAuthority("ROLE_USER")
						.requestMatchers("/api/applicant/apply", "/api/applicant/profile/**", "/api/employer/**", "/api/applicant/toggle", "/api/applicant/favourite-job").authenticated().anyRequest()
						.authenticated())
				.sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authenticationManager(authManager)
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of("http://localhost:5173"));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	@Bean
	public AuthenticationManager authManager(HttpSecurity http, CustomUserDetailsService userDetailsService)
			throws Exception {
		return http.getSharedObject(AuthenticationManagerBuilder.class).userDetailsService(userDetailsService)
				.passwordEncoder(passwordEncoder()).and().build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public Filter coopCoepFilter() {
		return new Filter() {
			@Override
			public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
					throws IOException, ServletException {

				HttpServletResponse res = (HttpServletResponse) response;
				res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
				res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");

				chain.doFilter(request, response);
			}
		};
	}

    // @Bean
    // public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authManager, JwtFilter jwtFilter)
    //         throws Exception {

    //     http
    //         .cors(cors -> cors.configurationSource(corsConfigurationSource()))
    //         .csrf(AbstractHttpConfigurer::disable)
    //         .authorizeHttpRequests(auth -> auth
    //             .requestMatchers("/api/auth/**", "/uploads/**", "/api/skills/list", "/api/employer/uploadLogo", "/api/employer/register",  "/api/employer/register/verify**").permitAll()
    //             .requestMatchers(HttpMethod.POST, "/api/employer/recruitment/create").hasAuthority("ROLE_employer")
    //             .requestMatchers("/api/employer/**").authenticated()
    //             .anyRequest().permitAll()
    //         )
    //         .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    //         .authenticationManager(authManager)
    //         .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    //     return http.build();
    // }
}
