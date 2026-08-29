package com.campusos.controller;

import com.campusos.model.Meeting;
import com.campusos.repository.MeetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/meeting")
public class MeetingController {

    @Autowired
    private MeetingRepository meetingRepository;

    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleMeeting(@RequestBody Meeting meeting) {
        if (meeting.getCreatedById() == null) meeting.setCreatedById(1L);
        meetingRepository.save(meeting);
        return ResponseEntity.ok(meeting);
    }

    @GetMapping("/my-meetings")
    public ResponseEntity<?> getMyMeetings(@RequestParam(value = "user_id", required = false) Long userId) {
        Long uId = userId != null ? userId : 1L;
        return ResponseEntity.ok(meetingRepository.findByCreatedById(uId));
    }
}
