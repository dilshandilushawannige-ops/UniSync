package com.smartcampus.unisync.security;

import com.smartcampus.unisync.user.entity.User;
import com.smartcampus.unisync.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.smartcampus.unisync.user.entity.User;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendBaseUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        String authority = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        System.out.println("=== OAuth2 Success Handler ===");
        System.out.println("User authenticated with authority: " + authority);
        System.out.println("All authorities: " + authentication.getAuthorities());

        // Get user email from OAuth2User
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        
        // Find user ID from database
        Long userId = null;
        if (email != null) {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                userId = user.getId();
                System.out.println("Found user ID: " + userId + " for email: " + email);
            }
        }

        String frontendRole;
        switch (authority) {
            case "ROLE_ADMIN":
                frontendRole = "admin";
                break;
            case "ROLE_TECHNICIAN":
                frontendRole = "technician";
                break;
            case "ROLE_USER":
                frontendRole = "student";
                break;
            default:
                frontendRole = "student";
                break;
        }

        String token = "google-oauth-success";
        Long userId = null;
        if (authentication.getPrincipal() instanceof CustomUserPrincipal principal) {
            User user = principal.getUser();
            userId = user != null ? user.getId() : null;
        }

        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
        String encodedRole = URLEncoder.encode(frontendRole, StandardCharsets.UTF_8);
        String encodedUserId = userId != null
                ? URLEncoder.encode(String.valueOf(userId), StandardCharsets.UTF_8)
                : "";

        String base = frontendBaseUrl.endsWith("/")
                ? frontendBaseUrl.substring(0, frontendBaseUrl.length() - 1)
                : frontendBaseUrl;
        String targetUrl = base + "/oauth-success?token=" + encodedToken + "&role=" + encodedRole;
        
        // Add userId to the redirect URL if found
        if (userId != null) {
            targetUrl += "&userId=" + userId;
        }

        System.out.println("Mapped frontend role: " + frontendRole);
        System.out.println("Redirecting to: " + targetUrl);
        System.out.println("==============================");

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}