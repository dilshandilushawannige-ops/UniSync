package com.smartcampus.unisync.booking.service;

import com.smartcampus.unisync.booking.dto.BookingRequestDto;
import com.smartcampus.unisync.booking.dto.BookingResponseDto;
import com.smartcampus.unisync.booking.dto.BookingStatusUpdateDto;
import com.smartcampus.unisync.common.enums.BookingStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingService {

    BookingResponseDto createBooking(BookingRequestDto requestDto);

    List<BookingResponseDto> getMyBookings(Long userId);

    List<BookingResponseDto> getAllBookings(BookingStatus status);

    BookingResponseDto updateBookingStatus(Long bookingId, BookingStatusUpdateDto statusUpdateDto);

    void cancelBooking(Long bookingId, Long userId);

    /**
     * True if no other PENDING/APPROVED booking overlaps this resource, date, and time range.
     *
     * @param excludeBookingId optional booking id to ignore (same row when approving)
     */
    boolean isSlotAvailable(
            Long resourceId,
            LocalDate bookingDate,
            LocalTime startTime,
            LocalTime endTime,
            Long excludeBookingId
    );
}
