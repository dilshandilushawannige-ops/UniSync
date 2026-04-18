package com.smartcampus.unisync.booking.service;

import com.smartcampus.unisync.booking.dto.BookingRequestDto;
import com.smartcampus.unisync.booking.dto.BookingResponseDto;
import com.smartcampus.unisync.booking.dto.BookingStatusUpdateDto;
import com.smartcampus.unisync.common.enums.BookingStatus;

import java.util.List;

public interface BookingService {

    BookingResponseDto createBooking(BookingRequestDto requestDto);

    List<BookingResponseDto> getMyBookings(Long userId);

    List<BookingResponseDto> getAllBookings(BookingStatus status);

    BookingResponseDto updateBookingStatus(Long bookingId, BookingStatusUpdateDto statusUpdateDto);

    void cancelBooking(Long bookingId, Long userId);
}
