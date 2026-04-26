package com.smartcampus.unisync.announcement.service;

import com.smartcampus.unisync.announcement.dto.AnnouncementRequestDto;
import com.smartcampus.unisync.announcement.dto.AnnouncementResponseDto;
import com.smartcampus.unisync.announcement.entity.Announcement;
import com.smartcampus.unisync.announcement.repository.AnnouncementRepository;
import com.smartcampus.unisync.common.enums.UserRole;
import com.smartcampus.unisync.notification.dto.NotificationRequestDto;
import com.smartcampus.unisync.notification.service.NotificationService;
import com.smartcampus.unisync.user.entity.User;
import com.smartcampus.unisync.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    @Transactional
    public AnnouncementResponseDto createAnnouncement(AnnouncementRequestDto requestDto) {
        Announcement announcement = new Announcement();
        announcement.setTitle(requestDto.getTitle());
        announcement.setMessage(requestDto.getMessage());
        announcement.setTarget(String.join(",", requestDto.getTargetRoles()));
        announcement.setPriority(requestDto.getPriority());
        announcement.setStatus(requestDto.getStatus());

        Announcement saved = announcementRepository.save(announcement);
        
        // Create notifications for target users
        createNotificationsForAnnouncement(saved, requestDto.getTargetRoles());
        
        return mapToResponseDto(saved);
    }
    
    private void createNotificationsForAnnouncement(Announcement announcement, List<String> targetRoles) {
        System.out.println("=== Creating notifications for announcement: " + announcement.getTitle());
        System.out.println("=== Target roles: " + targetRoles);
        
        List<User> targetUsers = new ArrayList<>();
        
        // If target includes "ALL", get all users
        if (targetRoles.contains("ALL")) {
            targetUsers = userRepository.findAll();
            System.out.println("=== Found " + targetUsers.size() + " users for ALL target");
        } else {
            // Get users for each specified role
            for (String roleStr : targetRoles) {
                try {
                    UserRole role = UserRole.valueOf(roleStr);
                    List<User> roleUsers = userRepository.findByRole(role);
                    targetUsers.addAll(roleUsers);
                    System.out.println("=== Found " + roleUsers.size() + " users for role: " + roleStr);
                } catch (IllegalArgumentException e) {
                    System.err.println("=== Invalid role: " + roleStr);
                }
            }
        }
        
        System.out.println("=== Creating notifications for " + targetUsers.size() + " users");
        
        // Create a notification for each target user
        int successCount = 0;
        for (User user : targetUsers) {
            NotificationRequestDto notificationDto = new NotificationRequestDto();
            notificationDto.setTitle(announcement.getTitle());
            notificationDto.setMessage(announcement.getMessage());
            notificationDto.setType("ANNOUNCEMENT");
            notificationDto.setRecipientEmail(user.getEmail());
            
            try {
                notificationService.createNotification(notificationDto);
                successCount++;
                System.out.println("=== Created notification for: " + user.getEmail());
            } catch (Exception e) {
                System.err.println("=== Failed to create notification for user: " + user.getEmail() + " - " + e.getMessage());
            }
        }
        
        System.out.println("=== Successfully created " + successCount + " notifications");
    }

    @Override
    public List<AnnouncementResponseDto> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public AnnouncementResponseDto getAnnouncementById(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found with id: " + id));
        return mapToResponseDto(announcement);
    }

    @Override
    @Transactional
    public AnnouncementResponseDto updateAnnouncement(Long id, AnnouncementRequestDto requestDto) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found with id: " + id));

        announcement.setTitle(requestDto.getTitle());
        announcement.setMessage(requestDto.getMessage());
        announcement.setTarget(String.join(",", requestDto.getTargetRoles()));
        announcement.setPriority(requestDto.getPriority());
        announcement.setStatus(requestDto.getStatus());

        Announcement updated = announcementRepository.save(announcement);
        return mapToResponseDto(updated);
    }

    @Override
    @Transactional
    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new RuntimeException("Announcement not found with id: " + id);
        }
        announcementRepository.deleteById(id);
    }

    @Override
    public List<AnnouncementResponseDto> getAnnouncementsForRole(String role) {
        List<Announcement> announcements = announcementRepository.findAllByOrderByCreatedAtDesc();
        return announcements.stream()
                .filter(a -> a.getTarget().contains("ALL") || a.getTarget().contains(role))
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private AnnouncementResponseDto mapToResponseDto(Announcement announcement) {
        AnnouncementResponseDto dto = new AnnouncementResponseDto();
        dto.setId(announcement.getId());
        dto.setTitle(announcement.getTitle());
        dto.setMessage(announcement.getMessage());
        dto.setTarget(Arrays.asList(announcement.getTarget().split(",")));
        dto.setPriority(announcement.getPriority());
        dto.setStatus(announcement.getStatus());
        dto.setCreatedAt(announcement.getCreatedAt().format(FORMATTER));
        dto.setUpdatedAt(announcement.getUpdatedAt());
        return dto;
    }
}
