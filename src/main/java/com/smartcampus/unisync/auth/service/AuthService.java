package com.smartcampus.unisync.auth.service;

import com.smartcampus.unisync.auth.dto.AuthResponseDto;
import com.smartcampus.unisync.auth.dto.LoginRequestDto;

public interface AuthService {

    AuthResponseDto login(LoginRequestDto loginRequestDto);

    AuthResponseDto checkAuth();
}