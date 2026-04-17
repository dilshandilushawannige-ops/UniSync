package com.smartcampus.unisync.user.service;

import com.smartcampus.unisync.user.dto.UserRequestDto;
import com.smartcampus.unisync.user.dto.UserResponseDto;

import java.util.List;

public interface UserService {

    UserResponseDto createUser(UserRequestDto userRequestDto);

    List<UserResponseDto> getAllUsers();

    UserResponseDto getUserById(Long id);

    UserResponseDto updateUser(Long id, UserRequestDto userRequestDto);

    void deleteUser(Long id);
}