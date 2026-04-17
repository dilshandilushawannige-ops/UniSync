package com.smartcampus.unisync.auth.service;

import com.smartcampus.unisync.auth.dto.AuthResponseDto;
import com.smartcampus.unisync.auth.dto.LoginRequestDto;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Override
    public AuthResponseDto login(LoginRequestDto loginRequestDto) {
        if ("admin@gmail.com".equals(loginRequestDto.getEmail()) &&
                "1234".equals(loginRequestDto.getPassword())) {
            return new AuthResponseDto("Login successful", true);
        }

        return new AuthResponseDto("Invalid email or password", false);
    }

    @Override
    public AuthResponseDto checkAuth() {
        return new AuthResponseDto("Auth module working", true);
    }
}