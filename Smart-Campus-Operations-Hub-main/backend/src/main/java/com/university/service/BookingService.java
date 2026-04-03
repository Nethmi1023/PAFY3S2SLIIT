package com.university.service;

import com.university.dto.BookingRequestDTO;
import com.university.dto.BookingResponseDTO;
import com.university.entity.Booking;
import com.university.entity.Resource;
import com.university.entity.enums.BookingStatus;
import com.university.entity.enums.ResourceStatus;
import com.university.exception.ResourceNotFoundException;
import com.university.exception.ResourceValidationException;
import com.university.repository.BookingRepository;
import com.university.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    /**
     * Create a new booking for the authenticated user
     */
    public BookingResponseDTO createBooking(BookingRequestDTO dto, String username) {
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + dto.getResourceId()));

        if (resource.getStatus() != ResourceStatus.AVAILABLE) {
            throw new ResourceValidationException("Resource is not available for booking");
        }

        LocalTime start = LocalTime.parse(dto.getStartTime(), TIME_FMT);
        LocalTime end = LocalTime.parse(dto.getEndTime(), TIME_FMT);

        if (!start.isBefore(end)) {
            throw new ResourceValidationException("Start time must be before end time");
        }

        // Check resource availability window
        if (resource.getAvailableFrom() != null && start.isBefore(resource.getAvailableFrom())) {
            throw new ResourceValidationException("Start time is before resource available hours");
        }
        if (resource.getAvailableTo() != null && end.isAfter(resource.getAvailableTo())) {
            throw new ResourceValidationException("End time is after resource available hours");
        }

        // Check for time conflicts on the same resource/date
        List<Booking> existing = bookingRepository
                .findByResourceIdAndBookingDateAndStatusNot(dto.getResourceId(), dto.getBookingDate(), BookingStatus.CANCELLED);

        boolean conflict = existing.stream().anyMatch(b ->
                start.isBefore(b.getEndTime()) && end.isAfter(b.getStartTime()));

        if (conflict) {
            throw new ResourceValidationException("Resource is already booked for the selected time slot");
        }

        Booking booking = Booking.builder()
                .resourceId(resource.getId())
                .resourceName(resource.getName())
                .bookedBy(username)
                .bookingDate(dto.getBookingDate())
                .startTime(start)
                .endTime(end)
                .purpose(dto.getPurpose())
                .status(BookingStatus.PENDING)
                .build();

        Booking saved = bookingRepository.save(booking);
        log.info("Booking created: {} by {}", saved.getId(), username);
        return toDTO(saved);
    }

    /**
     * Get all bookings for the current user
     */
    public List<BookingResponseDTO> getMyBookings(String username) {
        return bookingRepository.findByBookedBy(username)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Get a single booking by ID (user can only see their own; admin sees all)
     */
    public BookingResponseDTO getBookingById(String id, String username, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));

        if (!isAdmin && !booking.getBookedBy().equals(username)) {
            throw new ResourceValidationException("Access denied to this booking");
        }
        return toDTO(booking);
    }

    /**
     * Cancel a booking (user cancels own; admin cancels any)
     */
    public BookingResponseDTO cancelBooking(String id, String username, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));

        if (!isAdmin && !booking.getBookedBy().equals(username)) {
            throw new ResourceValidationException("Access denied to this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ResourceValidationException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.updateTimestamp();
        return toDTO(bookingRepository.save(booking));
    }

    /**
     * Admin: get all bookings
     */
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Admin: confirm a booking
     */
    public BookingResponseDTO confirmBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResourceValidationException("Only PENDING bookings can be confirmed");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.updateTimestamp();
        return toDTO(bookingRepository.save(booking));
    }

    /**
     * Get bookings for a specific resource (admin)
     */
    public List<BookingResponseDTO> getBookingsByResource(String resourceId) {
        return bookingRepository.findByResourceId(resourceId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private BookingResponseDTO toDTO(Booking b) {
        return BookingResponseDTO.builder()
                .id(b.getId())
                .resourceId(b.getResourceId())
                .resourceName(b.getResourceName())
                .bookedBy(b.getBookedBy())
                .bookingDate(b.getBookingDate())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .purpose(b.getPurpose())
                .status(b.getStatus())
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }
}
