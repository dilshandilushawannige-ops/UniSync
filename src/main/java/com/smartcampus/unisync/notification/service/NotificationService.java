package com.smartcampus.unisync.notification.service;

import com.smartcampus.unisync.notification.dto.NotificationRequestDto;
import com.smartcampus.unisync.notification.dto.NotificationResponseDto;

import java.util.List;

public interface NotificationService {

    NotificationResponseDto createNotification(NotificationRequestDto notificationRequestDto);

    List<NotificationResponseDto> getAllNotifications();

    List<NotificationResponseDto> getNotificationsByRecipientEmail(String recipientEmail);

    NotificationResponseDto markAsRead(Long id);

    void deleteNotification(Long id);
}