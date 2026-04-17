package com.smartcampus.unisync.notification.dto;

public class NotificationRequestDto {

    private String title;
    private String message;
    private String type;
    private String recipientEmail;

    public NotificationRequestDto() {
    }

    public NotificationRequestDto(String title, String message, String type, String recipientEmail) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.recipientEmail = recipientEmail;
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

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }
}