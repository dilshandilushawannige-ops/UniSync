package com.smartcampus.unisync.notification.dto;

public class NotificationResponseDto {

    private Long id;
    private String title;
    private String message;
    private String type;
    private boolean read;
    private String recipientEmail;

    public NotificationResponseDto() {
    }

    public NotificationResponseDto(Long id, String title, String message, String type, boolean read,
            String recipientEmail) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.read = read;
        this.recipientEmail = recipientEmail;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }
}