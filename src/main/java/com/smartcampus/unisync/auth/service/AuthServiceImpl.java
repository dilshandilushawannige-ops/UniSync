package com.smartcampus.unisync.auth.service;

import com.smartcampus.unisync.auth.dto.AuthResponseDto;
import com.smartcampus.unisync.auth.dto.LoginRequestDto;
import com.smartcampus.unisync.auth.dto.SignupRequestDto;
import com.smartcampus.unisync.common.enums.UserRole;
import com.smartcampus.unisync.user.entity.User;
import com.smartcampus.unisync.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AuthResponseDto signup(SignupRequestDto signupRequestDto) {
        // Check if email already exists
        if (userRepository.findByEmail(signupRequestDto.getEmail()).isPresent()) {
            return new AuthResponseDto("Email already registered", false);
        }

        // Create new user
        User user = new User();
        user.setFullName(signupRequestDto.getUsername());
        user.setEmail(signupRequestDto.getEmail());
        user.setPassword(signupRequestDto.getPassword());
        
        // Set role based on signup request
        try {
            user.setRole(UserRole.valueOf(signupRequestDto.getRole()));
        } catch (IllegalArgumentException e) {
            user.setRole(UserRole.USER); // Default to USER if invalid role
        }

        // Save user
        userRepository.save(user);

        return new AuthResponseDto("Account created successfully", true);
    }

    @Override
    public AuthResponseDto login(LoginRequestDto loginRequestDto) {
        // Find user by email
        User user = userRepository.findByEmail(loginRequestDto.getEmail()).orElse(null);

        if (user == null) {
            return new AuthResponseDto("Invalid email or password", false);
        }

        // Check if user has a password (OAuth users won't have password)
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return new AuthResponseDto("Please login using Google or GitHub", false);
        }

        // Check password (in production, use password encoder)
        if (!loginRequestDto.getPassword().equals(user.getPassword())) {
            return new AuthResponseDto("Invalid email or password", false);
        }

        // Generate a simple token (in production, use JWT)
        String token = UUID.randomUUID().toString();

        // Return success with user details
        return new AuthResponseDto(
            "Login successful",
            true,
            token,
            user.getRole().name(),
            user.getId(),
            user.getEmail()
        );
    }

    @Override
    public AuthResponseDto checkAuth() {
        return new AuthResponseDto("Auth module working", true);
    }
}