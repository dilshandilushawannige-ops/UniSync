package com.smartcampus.unisync.auth.dto;

public class AuthResponseDto {

    private String message;
    private boolean success;
    private String token;
    private String role;
    private Long userId;
    private String email;

    public AuthResponseDto() {
    }

    public AuthResponseDto(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    public AuthResponseDto(String message, boolean success, String token, String role, Long userId) {
        this.message = message;
        this.success = success;
        this.token = token;
        this.role = role;
        this.userId = userId;
    }

    public AuthResponseDto(String message, boolean success, String token, String role, Long userId, String email) {
        this.message = message;
        this.success = success;
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}