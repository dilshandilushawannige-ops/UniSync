package com.smartcampus.unisync.notification.repository;

import com.smartcampus.unisync.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientEmailOrderByIdDesc(String recipientEmail);
}