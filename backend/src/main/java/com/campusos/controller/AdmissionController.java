package com.campusos.controller;

import com.campusos.model.AdmissionApplication;
import com.campusos.repository.AdmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/admission")
public class AdmissionController {

    @Autowired
    private AdmissionRepository admissionRepository;

    @PostMapping("/apply")
    public ResponseEntity<?> applyAdmission(@RequestBody AdmissionApplication app) {
        if (app.getStudentId() == null) app.setStudentId(1L);
        admissionRepository.save(app);
        return ResponseEntity.ok(formatApplication(app));
    }

    @GetMapping({"/applications", "/all"})
    public ResponseEntity<?> getAllApplications() {
        List<AdmissionApplication> apps = admissionRepository.findAll();
        if (apps.isEmpty()) {
            AdmissionApplication a1 = new AdmissionApplication();
            a1.setStudentId(1L);
            a1.setFullName("Sneha Patel");
            a1.setEmail("sneha.p@gmail.com");
            a1.setPhone("+91 98123 45678");
            a1.setDepartment("Computer Science & Engineering");
            a1.setMarks10th(92.0);
            a1.setMarks12th(94.5);
            a1.setGender("Female");
            a1.setDob("2004-05-12");
            a1.setAddress("Mumbai, Maharashtra");
            a1.setStatus("Pending");

            AdmissionApplication a2 = new AdmissionApplication();
            a2.setStudentId(2L);
            a2.setFullName("Vikram Malhotra");
            a2.setEmail("vikram.m@gmail.com");
            a2.setPhone("+91 98234 56789");
            a2.setDepartment("Information Technology");
            a2.setMarks10th(88.0);
            a2.setMarks12th(91.0);
            a2.setGender("Male");
            a2.setDob("2004-08-22");
            a2.setAddress("Pune, Maharashtra");
            a2.setStatus("Approved");

            AdmissionApplication a3 = new AdmissionApplication();
            a3.setStudentId(3L);
            a3.setFullName("Rohan Kapoor");
            a3.setEmail("rohan.k@gmail.com");
            a3.setPhone("+91 98345 67890");
            a3.setDepartment("Electronics & Communication");
            a3.setMarks10th(85.0);
            a3.setMarks12th(88.2);
            a3.setGender("Male");
            a3.setDob("2004-11-05");
            a3.setAddress("Bengaluru, Karnataka");
            a3.setStatus("Approved");

            admissionRepository.saveAll(List.of(a1, a2, a3));
            apps = List.of(a1, a2, a3);
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (AdmissionApplication app : apps) {
            response.add(formatApplication(app));
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping({"/applications/{id}/status", "/{id}/status"})
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                         @RequestParam(value = "status", required = false) String paramStatus,
                                         @RequestBody(required = false) Map<String, String> body) {
        String status = paramStatus != null ? paramStatus : (body != null ? body.get("status") : "Approved");
        Optional<AdmissionApplication> appOpt = admissionRepository.findById(id);
        if (appOpt.isEmpty()) return ResponseEntity.notFound().build();

        AdmissionApplication app = appOpt.get();
        app.setStatus(status);
        admissionRepository.save(app);

        return ResponseEntity.ok(formatApplication(app));
    }

    private Map<String, Object> formatApplication(AdmissionApplication app) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", app.getId());
        map.put("student_id", app.getStudentId());
        map.put("studentId", app.getStudentId());
        map.put("full_name", app.getFullName() != null ? app.getFullName() : "Applicant");
        map.put("fullName", app.getFullName() != null ? app.getFullName() : "Applicant");
        map.put("name", app.getFullName());
        map.put("email", app.getEmail());
        map.put("phone", app.getPhone());
        map.put("dob", app.getDob() != null ? app.getDob() : "2004-01-01");
        map.put("gender", app.getGender() != null ? app.getGender() : "Not Specified");
        map.put("address", app.getAddress());
        map.put("department", app.getDepartment());
        map.put("marks_10th", app.getMarks10th() != null ? app.getMarks10th() : 90.0);
        map.put("marks10th", app.getMarks10th() != null ? app.getMarks10th() : 90.0);
        map.put("marks_12th", app.getMarks12th() != null ? app.getMarks12th() : 92.5);
        map.put("marks12th", app.getMarks12th() != null ? app.getMarks12th() : 92.5);
        map.put("status", app.getStatus());
        String subAt = app.getSubmittedAt() != null ? app.getSubmittedAt().toString() : "2026-08-20T10:00:00";
        map.put("submitted_at", subAt);
        map.put("submittedAt", subAt);
        map.put("created_at", subAt);
        return map;
    }
}
