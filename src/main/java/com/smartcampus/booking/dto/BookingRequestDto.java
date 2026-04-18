package com.smartcampus.booking.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequestDto {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "User name is required")
    private String userName;

    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    @NotBlank(message = "Resource name is required")
    private String resourceName;

    @NotBlank(message = "Resource type is required")
    private String resourceType;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date cannot be in the past")
    private LocalDate bookingDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @Min(value = 1, message = "Expected attendees must be at least 1")
    private Integer expectedAttendees;
}
