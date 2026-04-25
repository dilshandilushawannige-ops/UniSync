package com.smartcampus.unisync.auth.dto;

public class SignupRequestDto {

    private String username;
    private String email;
    private String password;
    private String contact;
    private String role;

    public SignupRequestDto() {
    }

    public SignupRequestDto(String username, String email, String password, String contact, String role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.contact = contact;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
