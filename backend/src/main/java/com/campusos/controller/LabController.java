package com.campusos.controller;

import com.campusos.model.Lab;
import com.campusos.model.LabBooking;
import com.campusos.repository.LabBookingRepository;
import com.campusos.repository.LabRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/lab")
public class LabController {

    @Autowired
    private LabRepository labRepository;

    @Autowired
    private LabBookingRepository bookingRepository;

    public static class LabBookingReq {
        public Long lab_id;
        public Long student_id;
        public String booking_date;
        public String start_time;
        public String end_time;
        public String purpose;
    }

    @GetMapping("/labs")
    public ResponseEntity<?> getActiveLabs() {
        return ResponseEntity.ok(labRepository.findByIsActive(true));
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookLab(@RequestBody LabBookingReq req) {
        Long lId = req != null && req.lab_id != null ? req.lab_id : 1L;
        Long sId = req != null && req.student_id != null ? req.student_id : 1L;

        LabBooking booking = new LabBooking(
                sId, lId,
                req != null && req.booking_date != null ? req.booking_date : "2026-09-01",
                req != null && req.start_time != null ? req.start_time : "10:00",
                req != null && req.end_time != null ? req.end_time : "12:00",
                req != null && req.purpose != null ? req.purpose : "AI Model Training Lab Work"
        );
        bookingRepository.save(booking);

        return ResponseEntity.ok(booking);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyLabBookings(@RequestParam(value = "student_id", required = false) Long studentId) {
        Long sId = studentId != null ? studentId : 1L;
        return ResponseEntity.ok(bookingRepository.findByStudentId(sId));
    }
}
