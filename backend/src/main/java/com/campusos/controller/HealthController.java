package com.campusos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
                "message", "🎓 Welcome to CampusOS API (Java Spring Boot Edition)!",
                "status", "running",
                "docs", "/swagger-ui/index.html"
        ));
    }
}
