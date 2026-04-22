package com.smartcampus.unisync.security;

import com.smartcampus.unisync.user.entity.User;
import com.smartcampus.unisync.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        // Get role
        String authority = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        System.out.println("=== OAuth2 Success Handler ===");
        System.out.println("Authority: " + authority);

        // Get email from OAuth2
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");

        // Find userId from DB
        Long userId = null;
        if (email != null) {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                userId = user.getId();
                System.out.println("Found user ID: " + userId);
            }
        }

        // Map role to frontend role
        String frontendRole;
        switch (authority) {
            case "ROLE_ADMIN" -> frontendRole = "admin";
            case "ROLE_TECHNICIAN" -> frontendRole = "technician";
            default -> frontendRole = "student";
        }

        // Token (temporary placeholder)
        String token = "google-oauth-success";

        // Encode values
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
        String encodedRole = URLEncoder.encode(frontendRole, StandardCharsets.UTF_8);

        // Build redirect URL
        String targetUrl = "http://localhost:5173/oauth-success"
                + "?token=" + encodedToken
                + "&role=" + encodedRole;

        if (userId != null) {
            targetUrl += "&userId=" + userId;
        }

        System.out.println("Redirecting to: " + targetUrl);
        System.out.println("==============================");

        if (response.isCommitted()) {
            return;
        }

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}