package com.smartcampus.notification.service;

import com.smartcampus.notification.dto.NotificationRequestDto;
import com.smartcampus.notification.dto.NotificationResponseDto;
import com.smartcampus.notification.entity.Notification;
import com.smartcampus.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public NotificationResponseDto createNotification(NotificationRequestDto notificationRequestDto) {
        Notification notification = new Notification();
        notification.setTitle(notificationRequestDto.getTitle());
        notification.setMessage(notificationRequestDto.getMessage());
        notification.setType(notificationRequestDto.getType());
        notification.setRecipientEmail(notificationRequestDto.getRecipientEmail());
        notification.setRead(false);

        Notification savedNotification = notificationRepository.save(notification);
        return mapToResponse(savedNotification);
    }

    @Override
    public List<NotificationResponseDto> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationResponseDto> getNotificationsByRecipientEmail(String recipientEmail) {
        return notificationRepository.findByRecipientEmailOrderByIdDesc(recipientEmail)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationResponseDto markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));

        notification.setRead(true);
        Notification updatedNotification = notificationRepository.save(notification);

        return mapToResponse(updatedNotification);
    }

    @Override
    public void deleteNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));

        notificationRepository.delete(notification);
    }

    private NotificationResponseDto mapToResponse(Notification notification) {
        return new NotificationResponseDto(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getRecipientEmail());
    }
}
