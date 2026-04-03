package com.university.controller;

import com.university.dto.BookingRequestDTO;
import com.university.dto.BookingResponseDTO;
import com.university.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Booking management
 * POST   /api/bookings              - create booking (USER/ADMIN)
 * GET    /api/bookings/my           - get own bookings (USER/ADMIN)
 * GET    /api/bookings/{id}         - get booking by id (USER sees own, ADMIN sees all)
 * PUT    /api/bookings/{id}/cancel  - cancel booking (USER cancels own, ADMIN cancels any)
 * GET    /api/bookings              - get all bookings (ADMIN only)
 * PUT    /api/bookings/{id}/confirm - confirm booking (ADMIN only)
 * GET    /api/bookings/resource/{resourceId} - bookings for a resource (ADMIN only)
 */
@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO dto,
            Authentication auth) {
        log.info("POST /bookings by {}", auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(dto, auth.getName()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(Authentication auth) {
        return ResponseEntity.ok(bookingService.getMyBookings(auth.getName()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<BookingResponseDTO> getBookingById(
            @PathVariable String id, Authentication auth) {
        boolean isAdmin = isAdmin(auth);
        return ResponseEntity.ok(bookingService.getBookingById(id, auth.getName(), isAdmin));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable String id, Authentication auth) {
        boolean isAdmin = isAdmin(auth);
        return ResponseEntity.ok(bookingService.cancelBooking(id, auth.getName(), isAdmin));
    }

    // ---- Admin endpoints ----

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> confirmBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.confirmBooking(id));
    }

    @GetMapping("/resource/{resourceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByResource(
            @PathVariable String resourceId) {
        return ResponseEntity.ok(bookingService.getBookingsByResource(resourceId));
    }

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));
    }
}
