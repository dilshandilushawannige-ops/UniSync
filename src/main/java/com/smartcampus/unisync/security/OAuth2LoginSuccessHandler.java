package com.smartcampus.unisync.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.smartcampus.unisync.user.entity.User;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final String frontendBaseUrl;

    public OAuth2LoginSuccessHandler(@Value("${app.frontend-base-url:http://localhost:5173}") String frontendBaseUrl) {
        this.frontendBaseUrl = frontendBaseUrl;
    }

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

        String normalizedFrontendBaseUrl = frontendBaseUrl.replaceAll("/+$", "");
        String targetUrl = normalizedFrontendBaseUrl + "/oauth-success?token=" + encodedToken + "&role=" + encodedRole;
        if (!encodedUserId.isEmpty()) {
            targetUrl = targetUrl + "&userId=" + encodedUserId;
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