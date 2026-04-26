package com.smartcampus.unisync.security;

import com.smartcampus.unisync.common.enums.UserRole;
import com.smartcampus.unisync.user.entity.User;
import com.smartcampus.unisync.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        
        System.out.println("=== OAuth2 Login Debug ===");
        System.out.println("Email: " + email);
        System.out.println("Name: " + name);
        
        // Get the role from session if available
        UserRole selectedRole = UserRole.USER; // Default
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String roleParam = (String) request.getSession().getAttribute("pendingOAuthRole");
                System.out.println("Session ID in UserService: " + request.getSession().getId());
                System.out.println("Role from session: " + roleParam);
                
                if (roleParam != null) {
                    if ("TECHNICIAN".equalsIgnoreCase(roleParam)) {
                        selectedRole = UserRole.TECHNICIAN;
                        System.out.println("Role set to TECHNICIAN");
                    } else if ("USER".equalsIgnoreCase(roleParam)) {
                        selectedRole = UserRole.USER;
                        System.out.println("Role set to USER");
                    }
                } else {
                    System.out.println("WARNING: No role found in session, using default USER");
                }
            } else {
                System.out.println("WARNING: No request attributes available");
            }
        } catch (Exception e) {
            System.out.println("ERROR retrieving role from session: " + e.getMessage());
            e.printStackTrace();
        }
        
        final UserRole roleToUse = selectedRole;
        System.out.println("Selected role for new user: " + roleToUse);
        
        User user = userRepository.findByEmail(email)
                .map(existingUser -> {
                    // Use the role from database for existing users
                    System.out.println("Existing user found with role: " + existingUser.getRole());
                    return existingUser;
                })
                .orElseGet(() -> {
                    // Create new user with selected role
                    System.out.println("Creating new user with role: " + roleToUse);
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFullName(name != null ? name : email);
                    newUser.setRole(roleToUse);
                    return userRepository.save(newUser);
                });
        
        System.out.println("Final user role: " + user.getRole());
        System.out.println("=========================");
        
        return new CustomUserPrincipal(user, oauth2User.getAttributes());
    }
}
