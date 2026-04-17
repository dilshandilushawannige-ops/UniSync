package com.smartcampus.unisync.notification.controller;

import com.smartcampus.unisync.notification.dto.NotificationRequestDto;
import com.smartcampus.unisync.notification.dto.NotificationResponseDto;
import com.smartcampus.unisync.notification.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<NotificationResponseDto> createNotification(
            @RequestBody NotificationRequestDto notificationRequestDto) {
        return ResponseEntity.ok(notificationService.createNotification(notificationRequestDto));
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @GetMapping("/user")
    public ResponseEntity<List<NotificationResponseDto>> getNotificationsByRecipientEmail(
            @RequestParam String email) {
        return ResponseEntity.ok(notificationService.getNotificationsByRecipientEmail(email));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDto> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok("Notification deleted successfully");
    }
}