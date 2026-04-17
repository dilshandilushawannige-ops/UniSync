package com.smartcampus.unisync.config;

import com.smartcampus.unisync.security.CustomOAuth2UserService;
import com.smartcampus.unisync.security.OAuth2LoginSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

        @Autowired(required = false)
        private CustomOAuth2UserService customOAuth2UserService;
        
        @Autowired(required = false)
        private OAuth2LoginSuccessHandler successHandler;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(auth -> auth
                                                .anyRequest().permitAll()); // Allow all requests for development
                
                // Only configure OAuth2 if the beans are available
                if (customOAuth2UserService != null && successHandler != null) {
                        http.oauth2Login(oauth -> oauth
                                        .userInfoEndpoint(userInfo -> userInfo
                                                        .userService(customOAuth2UserService))
                                        .successHandler(successHandler));
                }

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000")); // Adjust
                                                                                                                  // based
                                                                                                                  // on
                                                                                                                  // frontend
                                                                                                                  // URLs
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(Arrays.asList("*"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}