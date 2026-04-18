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
                    // Use the role from database for existing users
                    System.out.println("Existing user found with role: " + existingUser.getRole());
                    return existingUser;
                })
                .orElseGet(() -> {
                    // Create new user with default role (USER/student)
                    System.out.println("Creating new user with default role: USER");
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFullName(name != null ? name : email);
                    newUser.setRole(UserRole.USER); // Default role for new users
                    return userRepository.save(newUser);
                });
        
        System.out.println("Final user role: " + user.getRole());
        System.out.println("=========================");
        
        return new CustomUserPrincipal(user, oauth2User.getAttributes());
    }
}
