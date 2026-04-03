package com.university.repository;

import com.university.entity.Booking;
import com.university.entity.enums.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByBookedBy(String username);

    List<Booking> findByResourceId(String resourceId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByResourceIdAndBookingDate(String resourceId, LocalDate date);

    // Check for overlapping bookings on the same resource/date (excluding CANCELLED)
    List<Booking> findByResourceIdAndBookingDateAndStatusNot(
            String resourceId, LocalDate date, BookingStatus status);
}
