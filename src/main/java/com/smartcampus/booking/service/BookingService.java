package com.smartcampus.booking.service;

import com.smartcampus.booking.dto.BookingRequestDto;
import com.smartcampus.booking.dto.BookingResponseDto;
import com.smartcampus.booking.dto.BookingStatusUpdateDto;
import com.smartcampus.common.enums.BookingStatus;

import java.util.List;

public interface BookingService {

    BookingResponseDto createBooking(BookingRequestDto requestDto);

    List<BookingResponseDto> getMyBookings(Long userId);

    List<BookingResponseDto> getAllBookings(BookingStatus status);

    BookingResponseDto updateBookingStatus(Long bookingId, BookingStatusUpdateDto statusUpdateDto);

    void cancelBooking(Long bookingId, Long userId);
}
