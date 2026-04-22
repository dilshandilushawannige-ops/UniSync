package com.smartcampus.unisync.booking.controller;

import com.smartcampus.unisync.booking.dto.BookingRequestDto;
import com.smartcampus.unisync.booking.dto.BookingResponseDto;
import com.smartcampus.unisync.booking.dto.BookingStatusUpdateDto;
import com.smartcampus.unisync.booking.service.BookingService;
import com.smartcampus.unisync.common.enums.BookingStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@Valid @RequestBody BookingRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(requestDto));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDto>> getMyBookings(@RequestParam Long userId) {
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    /**
     * Optional helper for UI: check if a resource is free for a date/time range
     * (no overlapping PENDING or APPROVED booking).
     */
    @GetMapping("/availability")
    public ResponseEntity<Map<String, Boolean>> checkAvailability(
            @RequestParam Long resourceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime,
            @RequestParam(required = false) Long excludeBookingId
    ) {
        boolean available = bookingService.isSlotAvailable(resourceId, date, startTime, endTime, excludeBookingId);
        return ResponseEntity.ok(Map.of("available", available));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings(
            @RequestParam(required = false) BookingStatus status
    ) {
        return ResponseEntity.ok(bookingService.getAllBookings(status));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponseDto> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateDto statusUpdateDto
    ) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, statusUpdateDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        bookingService.cancelBooking(id, userId);
        return ResponseEntity.noContent().build();
    }
}
