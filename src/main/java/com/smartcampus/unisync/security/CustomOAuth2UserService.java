package com.smartcampus.unisync.security;

import com.smartcampus.unisync.common.enums.UserRole;
import com.smartcampus.unisync.user.entity.User;
import com.smartcampus.unisync.user.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

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
        
        User user = userRepository.findByEmail(email)
                .map(existingUser -> {
                    // Update role for existing user based on email
                    UserRole correctRole = determineRoleByEmail(email);
                    System.out.println("Existing user found. Current role: " + existingUser.getRole() + ", Correct role: " + correctRole);
                    if (existingUser.getRole() != correctRole) {
                        existingUser.setRole(correctRole);
                        System.out.println("Updating user role to: " + correctRole);
                        return userRepository.save(existingUser);
                    }
                    return existingUser;
                })
                .orElseGet(() -> {
                    // Create new user with correct role
                    UserRole correctRole = determineRoleByEmail(email);
                    System.out.println("Creating new user with role: " + correctRole);
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFullName(name != null ? name : email);
                    newUser.setRole(correctRole);
                    return userRepository.save(newUser);
                });
        
        System.out.println("Final user role: " + user.getRole());
        System.out.println("=========================");
        
        return new CustomUserPrincipal(user, oauth2User.getAttributes());
    }
    
    private UserRole determineRoleByEmail(String email) {
        if (email == null) {
            return UserRole.USER;
        }
        
        // Map specific emails to roles
        switch (email.toLowerCase()) {
            case "ravinduthathsara38@gmail.com":
                return UserRole.ADMIN;
            case "nithakshidishara2002@gmail.com":
                return UserRole.TECHNICIAN;
            case "ravinduthathsara47@gmail.com":
                return UserRole.USER;
            default:
                return UserRole.USER; // Default role for other users
        }
    }
}
