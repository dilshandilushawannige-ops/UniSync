package com.smartcampus.auth.service;

import com.smartcampus.auth.dto.AuthResponseDto;
import com.smartcampus.auth.dto.LoginRequestDto;

public interface AuthService {

    AuthResponseDto login(LoginRequestDto loginRequestDto);

    AuthResponseDto checkAuth();
}
