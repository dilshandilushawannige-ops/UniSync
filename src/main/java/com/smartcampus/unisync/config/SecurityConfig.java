package com.smartcampus.unisync.config;

import com.smartcampus.unisync.security.CustomOAuth2UserService;
import com.smartcampus.unisync.security.OAuth2LoginSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

        private final CustomOAuth2UserService customOAuth2UserService;
        private final OAuth2LoginSuccessHandler successHandler;

        public SecurityConfig(CustomOAuth2UserService customOAuth2UserService,
                        OAuth2LoginSuccessHandler successHandler) {
                this.customOAuth2UserService = customOAuth2UserService;
                this.successHandler = successHandler;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http,
                        CorsConfigurationSource corsConfigurationSource) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/oauth2/**", "/login/oauth2/**", "/error").permitAll()
                                                .anyRequest().permitAll()); // Allow all requests for development

                http.oauth2Login(oauth -> oauth
                                .authorizationEndpoint(endpoint -> endpoint.baseUri("/oauth2/authorization"))
                                .redirectionEndpoint(endpoint -> endpoint.baseUri("/login/oauth2/code/*"))
                                .userInfoEndpoint(userInfo -> userInfo
                                                .userService(customOAuth2UserService))
                                .successHandler(successHandler));

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource(
                        @Value("${app.frontend.url:http://localhost:5173}") String appFrontendUrl) {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(Arrays.asList(
                                appFrontendUrl,
                                "http://localhost:5173",
                                "http://localhost:3000"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(Arrays.asList("*"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}