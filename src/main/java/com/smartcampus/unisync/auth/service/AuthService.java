package com.smartcampus.unisync.auth.service;

import com.smartcampus.unisync.auth.dto.AuthResponseDto;
import com.smartcampus.unisync.auth.dto.LoginRequestDto;
import com.smartcampus.unisync.auth.dto.SignupRequestDto;

public interface AuthService {

    AuthResponseDto login(LoginRequestDto loginRequestDto);

    AuthResponseDto signup(SignupRequestDto signupRequestDto);

    AuthResponseDto checkAuth();
}