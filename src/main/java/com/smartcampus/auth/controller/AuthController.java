package com.smartcampus.auth.controller;

import com.smartcampus.auth.dto.AuthResponseDto;
import com.smartcampus.auth.dto.LoginRequestDto;
import com.smartcampus.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/check")
    public ResponseEntity<AuthResponseDto> checkAuth() {
        return ResponseEntity.ok(authService.checkAuth());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
        AuthResponseDto response = authService.login(loginRequestDto);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(response);
    }
}
