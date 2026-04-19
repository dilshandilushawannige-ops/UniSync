package com.smartcampus.unisync.config;

import com.smartcampus.unisync.common.enums.UserRole;
import com.smartcampus.unisync.user.entity.User;
import com.smartcampus.unisync.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        initializeTestUsers();
    }

    private void initializeTestUsers() {
        System.out.println("=== Initializing Test Users ===");

        // Admin user
        createOrUpdateUser("ravinduthathsara38@gmail.com", "Admin User", UserRole.ADMIN);

        // Student user
        createOrUpdateUser("ravinduthathsara47@gmail.com", "Student User", UserRole.USER);

        // Technician user
        createOrUpdateUser("munasinghethathsara74@gmail.com", "Technician User", UserRole.TECHNICIAN);

        System.out.println("=== Test Users Initialized ===");
    }

    private void createOrUpdateUser(String email, String fullName, UserRole role) {
        userRepository.findByEmail(email)
                .ifPresentOrElse(
                        existingUser -> {
                            existingUser.setRole(role);
                            existingUser.setFullName(fullName);
                            userRepository.save(existingUser);
                            System.out.println("Updated user: " + email + " with role: " + role);
                        },
                        () -> {
                            User newUser = new User();
                            newUser.setEmail(email);
                            newUser.setFullName(fullName);
                            newUser.setRole(role);
                            userRepository.save(newUser);
                            System.out.println("Created user: " + email + " with role: " + role);
                        }
                );
    }
}
