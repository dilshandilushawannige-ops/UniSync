package com.smartcampus.unisync.booking.dto;

import com.smartcampus.unisync.common.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingStatusUpdateDto {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String rejectionReason;
}
