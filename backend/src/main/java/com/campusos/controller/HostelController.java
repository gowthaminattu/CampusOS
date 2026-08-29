package com.campusos.controller;

import com.campusos.model.HostelBooking;
import com.campusos.model.HostelRoom;
import com.campusos.repository.HostelBookingRepository;
import com.campusos.repository.HostelRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/hostel")
public class HostelController {

    @Autowired
    private HostelRoomRepository roomRepository;

    @Autowired
    private HostelBookingRepository bookingRepository;

    public static class BookingRequest {
        public Long room_id;
        public Long student_id;
        public String check_in_date;
        public String check_out_date;
    }

    @GetMapping("/rooms")
    public ResponseEntity<?> getAvailableRooms() {
        return ResponseEntity.ok(roomRepository.findByIsAvailable(true));
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookRoom(@RequestBody BookingRequest req) {
        Long rId = req != null && req.room_id != null ? req.room_id : 1L;
        Long sId = req != null && req.student_id != null ? req.student_id : 1L;
        String in = req != null && req.check_in_date != null ? req.check_in_date : "2026-09-01";
        String out = req != null ? req.check_out_date : "2027-06-30";

        HostelBooking booking = new HostelBooking(sId, rId, in, out);
        bookingRepository.save(booking);

        Optional<HostelRoom> roomOpt = roomRepository.findById(rId);
        roomOpt.ifPresent(r -> {
            r.setIsAvailable(false);
            roomRepository.save(r);
        });

        return ResponseEntity.ok(booking);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings(@RequestParam(value = "student_id", required = false) Long studentId) {
        Long sId = studentId != null ? studentId : 1L;
        return ResponseEntity.ok(bookingRepository.findByStudentId(sId));
    }
}
