package com.smartcampus.unisync.user.repository;

import com.smartcampus.unisync.common.enums.UserRole;
import com.smartcampus.unisync.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(UserRole role);
}
