package com.smartcampus.unisync.booking.repository;

import com.smartcampus.unisync.booking.entity.Booking;
import com.smartcampus.unisync.common.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    @Query("""
            SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
            FROM Booking b
            WHERE b.resourceId = :resourceId
            AND b.bookingDate = :bookingDate
            AND b.status IN :activeStatuses
            AND b.startTime < :newEndTime
            AND :newStartTime < b.endTime
            """)
    boolean existsOverlappingBooking(
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("newStartTime") LocalTime newStartTime,
            @Param("newEndTime") LocalTime newEndTime,
            @Param("activeStatuses") List<BookingStatus> activeStatuses
    );

    /** Same as overlap check but ignores one booking (e.g. self when approving, or editing). */
    @Query("""
            SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
            FROM Booking b
            WHERE b.resourceId = :resourceId
            AND b.bookingDate = :bookingDate
            AND b.status IN :activeStatuses
            AND b.id <> :excludeBookingId
            AND b.startTime < :newEndTime
            AND :newStartTime < b.endTime
            """)
    boolean existsOverlappingBookingExcluding(
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("newStartTime") LocalTime newStartTime,
            @Param("newEndTime") LocalTime newEndTime,
            @Param("activeStatuses") List<BookingStatus> activeStatuses,
            @Param("excludeBookingId") Long excludeBookingId
    );
}
