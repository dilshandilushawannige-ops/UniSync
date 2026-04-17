package com.smartcampus.unisync.user.service;

import com.smartcampus.unisync.user.dto.UserRequestDto;
import com.smartcampus.unisync.user.dto.UserResponseDto;
import com.smartcampus.unisync.user.entity.User;
import com.smartcampus.unisync.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponseDto createUser(UserRequestDto userRequestDto) {
        User user = new User();
        user.setFullName(userRequestDto.getFullName());
        user.setEmail(userRequestDto.getEmail());
        user.setRole(userRequestDto.getRole());

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return mapToResponse(user);
    }

    @Override
    public UserResponseDto updateUser(Long id, UserRequestDto userRequestDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setFullName(userRequestDto.getFullName());
        user.setEmail(userRequestDto.getEmail());
        user.setRole(userRequestDto.getRole());

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        userRepository.delete(user);
    }

    private UserResponseDto mapToResponse(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole());
    }
}