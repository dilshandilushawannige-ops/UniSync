package com.smartcampus.booking.service;

import com.smartcampus.booking.dto.BookingRequestDto;
import com.smartcampus.booking.dto.BookingResponseDto;
import com.smartcampus.booking.dto.BookingStatusUpdateDto;
import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.repository.BookingRepository;
import com.smartcampus.common.enums.BookingStatus;
import com.smartcampus.common.exception.BadRequestException;
import com.smartcampus.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private static final List<BookingStatus> ACTIVE_CONFLICT_STATUSES = List.of(
            BookingStatus.PENDING,
            BookingStatus.APPROVED
    );

    private final BookingRepository bookingRepository;

    @Override
    public BookingResponseDto createBooking(BookingRequestDto requestDto) {
        validateTimeRange(requestDto.getStartTime(), requestDto.getEndTime());

        boolean hasConflict = bookingRepository.existsOverlappingBooking(
                requestDto.getResourceId(),
                requestDto.getBookingDate(),
                requestDto.getStartTime(),
                requestDto.getEndTime(),
                ACTIVE_CONFLICT_STATUSES
        );

        if (hasConflict) {
            throw new BadRequestException("Booking conflict detected for the selected resource and time range.");
        }

        Booking booking = new Booking();
        booking.setUserId(requestDto.getUserId());
        booking.setUserName(requestDto.getUserName());
        booking.setResourceId(requestDto.getResourceId());
        booking.setResourceName(requestDto.getResourceName());
        booking.setResourceType(requestDto.getResourceType());
        booking.setBookingDate(requestDto.getBookingDate());
        booking.setStartTime(requestDto.getStartTime());
        booking.setEndTime(requestDto.getEndTime());
        booking.setPurpose(requestDto.getPurpose());
        booking.setExpectedAttendees(requestDto.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        return mapToDto(bookingRepository.save(booking));
    }

    @Override
    public List<BookingResponseDto> getMyBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDto> getAllBookings(BookingStatus status) {
        List<Booking> bookings = (status == null)
                ? bookingRepository.findAll()
                : bookingRepository.findByStatusOrderByCreatedAtDesc(status);

        return bookings.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public BookingResponseDto updateBookingStatus(Long bookingId, BookingStatusUpdateDto statusUpdateDto) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cancelled bookings cannot be updated.");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be approved or rejected.");
        }

        if (statusUpdateDto.getStatus() != BookingStatus.APPROVED
                && statusUpdateDto.getStatus() != BookingStatus.REJECTED) {
            throw new BadRequestException("Status update supports only APPROVED or REJECTED.");
        }

        if (statusUpdateDto.getStatus() == BookingStatus.REJECTED
                && (statusUpdateDto.getRejectionReason() == null || statusUpdateDto.getRejectionReason().isBlank())) {
            throw new BadRequestException("Rejection reason is required when rejecting a booking.");
        }

        booking.setStatus(statusUpdateDto.getStatus());
        booking.setRejectionReason(statusUpdateDto.getStatus() == BookingStatus.REJECTED
                ? statusUpdateDto.getRejectionReason()
                : null);

        return mapToDto(bookingRepository.save(booking));
    }

    @Override
    public void cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (!booking.getUserId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own bookings.");
        }

        if (booking.getStatus() == BookingStatus.REJECTED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Only pending or approved bookings can be cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private void validateTimeRange(LocalTime startTime, LocalTime endTime) {
        if (!startTime.isBefore(endTime)) {
            throw new BadRequestException("End time must be later than start time.");
        }
    }

    private BookingResponseDto mapToDto(Booking booking) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUserId());
        dto.setUserName(booking.getUserName());
        dto.setResourceId(booking.getResourceId());
        dto.setResourceName(booking.getResourceName());
        dto.setResourceType(booking.getResourceType());
        dto.setBookingDate(booking.getBookingDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setExpectedAttendees(booking.getExpectedAttendees());
        dto.setStatus(booking.getStatus());
        dto.setRejectionReason(booking.getRejectionReason());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        return dto;
    }
}
