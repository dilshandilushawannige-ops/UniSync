package com.smartcampus.notification.service;

import com.smartcampus.notification.dto.NotificationRequestDto;
import com.smartcampus.notification.dto.NotificationResponseDto;

import java.util.List;

public interface NotificationService {

    NotificationResponseDto createNotification(NotificationRequestDto notificationRequestDto);

    List<NotificationResponseDto> getAllNotifications();

    List<NotificationResponseDto> getNotificationsByRecipientEmail(String recipientEmail);

    NotificationResponseDto markAsRead(Long id);

    void deleteNotification(Long id);
}
