package com.campusos.controller;

import com.campusos.model.Notification;
import com.campusos.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/my-notifications")
    public ResponseEntity<?> getMyNotifications(@RequestParam(value = "user_id", required = false) Long userId) {
        Long uId = userId != null ? userId : 1L;
        List<Notification> notifs = notificationRepository.findByUserIdOrderByCreatedAtDesc(uId);
        if (notifs.isEmpty()) {
            // Seed a sample notification if none
            Notification n1 = new Notification(uId, "Campus Drive Announced: Amazon SDE-1 Recruitment 2026", "Just now", "placement");
            notificationRepository.save(n1);
            notifs = List.of(n1);
        }
        return ResponseEntity.ok(notifs);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Optional<Notification> nOpt = notificationRepository.findById(id);
        if (nOpt.isPresent()) {
            Notification n = nOpt.get();
            n.setRead(true);
            notificationRepository.save(n);
            return ResponseEntity.ok(n);
        }
        return ResponseEntity.notFound().build();
    }
}
