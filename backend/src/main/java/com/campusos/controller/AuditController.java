package com.campusos.controller;

import com.campusos.model.AuditLog;
import com.campusos.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping("/logs")
    public ResponseEntity<?> getLogs() {
        List<AuditLog> logs = auditLogRepository.findTop100ByOrderByTimestampDesc();
        if (logs.isEmpty()) {
            AuditLog l1 = new AuditLog(1L, "Aarav Sharma", "student", "LOGIN_SUCCESS", "AUTH");
            AuditLog l2 = new AuditLog(3L, "Priya Nair", "tpo", "CREATE_JOB_DRIVE", "PLACEMENT");
            auditLogRepository.saveAll(List.of(l1, l2));
            logs = List.of(l1, l2);
        }
        return ResponseEntity.ok(logs);
    }
}
