package com.campusos.controller;

import com.campusos.engine.EligibilityEngine;
import com.campusos.model.Company;
import com.campusos.model.JobApplication;
import com.campusos.model.JobDrive;
import com.campusos.model.User;
import com.campusos.repository.CompanyRepository;
import com.campusos.repository.JobApplicationRepository;
import com.campusos.repository.JobDriveRepository;
import com.campusos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/placement")
public class PlacementController {

    @Autowired
    private JobDriveRepository driveRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EligibilityEngine eligibilityEngine;

    public static class JdParseRequest {
        public String jd_text;
    }

    @GetMapping("/drives")
    public ResponseEntity<?> getDrives() {
        List<JobDrive> drives = driveRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();

        for (JobDrive d : drives) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", d.getId());
            map.put("company_id", d.getCompanyId());

            Optional<Company> compOpt = companyRepository.findById(d.getCompanyId());
            String compName = compOpt.isPresent() ? compOpt.get().getName() : "Enterprise Corporate Drive";
            map.put("company_name", compName);
            map.put("companyName", compName);

            map.put("title", d.getTitle());
            map.put("role", d.getRole());
            map.put("description", d.getDescription());
            map.put("min_cgpa", d.getMinCgpa());
            map.put("minCgpa", d.getMinCgpa());
            map.put("max_backlogs", d.getMaxBacklogs());
            map.put("maxBacklogs", d.getMaxBacklogs());
            map.put("allowed_branches", d.getAllowedBranches());
            map.put("allowedBranches", d.getAllowedBranches());
            map.put("required_skills", d.getRequiredSkills() != null ? Arrays.asList(d.getRequiredSkills().split("\\s*,\\s*")) : List.of("Java", "SQL"));
            map.put("package_lpa", d.getPackageLpa());
            map.put("packageLpa", d.getPackageLpa());
            map.put("location", d.getLocation());
            map.put("drive_date", d.getDriveDate());
            map.put("driveDate", d.getDriveDate());
            map.put("status", d.getStatus());

            response.add(map);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/parse-jd")
    public ResponseEntity<?> parseJd(@RequestBody JdParseRequest req) {
        String text = req != null && req.jd_text != null ? req.jd_text : "";

        Map<String, Object> parsed = new HashMap<>();
        parsed.put("company_name", text.toLowerCase().contains("amazon") ? "Amazon" : (text.toLowerCase().contains("google") ? "Google" : "Tech Global"));
        parsed.put("role", text.toLowerCase().contains("sde") ? "Software Development Engineer" : "Java Backend Engineer");
        parsed.put("min_cgpa", 7.5);
        parsed.put("max_backlogs", 0);
        parsed.put("allowed_branches", List.of("CSE", "ECE", "IT"));
        parsed.put("required_skills", List.of("Java", "Spring Boot", "REST API", "SQL", "DSA"));
        parsed.put("package_lpa", 18.5);
        parsed.put("location", "Bengaluru");

        return ResponseEntity.ok(parsed);
    }

    @GetMapping("/drives/{id}/eligibility")
    public ResponseEntity<?> getDriveEligibility(@PathVariable Long id) {
        Optional<JobDrive> driveOpt = driveRepository.findById(id);
        if (driveOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        JobDrive drive = driveOpt.get();
        List<User> students = userRepository.findByRole("student");

        List<EligibilityEngine.EligibilityCheckResult> results = new ArrayList<>();
        int eligibleCount = 0;

        for (User s : students) {
            EligibilityEngine.EligibilityCheckResult res = eligibilityEngine.evaluateEligibility(s, drive);
            results.add(res);
            if (res.isEligible) eligibleCount++;
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("drive", drive);
        summary.put("total_students_evaluated", students.size());
        summary.put("eligible_count", eligibleCount);
        summary.put("ineligible_count", students.size() - eligibleCount);
        summary.put("evaluations", results);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getJobRecommendations() {
        List<JobDrive> drives = driveRepository.findAll();
        List<Map<String, Object>> res = new ArrayList<>();

        for (JobDrive d : drives) {
            Map<String, Object> item = new HashMap<>();
            item.put("drive", d);
            item.put("match_score", 88.5);
            item.put("recommendation_reason", "Strong match for Java Developer skill benchmark & academic record");
            res.add(item);
        }

        return ResponseEntity.ok(res);
    }

    @PostMapping("/drives/{id}/apply")
    public ResponseEntity<?> applyToDrive(@PathVariable Long id, @RequestParam(value = "student_id", required = false) Long studentId) {
        Long sId = studentId != null ? studentId : 1L;
        JobApplication app = new JobApplication(sId, id, "Applied", "In Process", 85.0);
        applicationRepository.save(app);
        return ResponseEntity.ok(app);
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getApplications() {
        return ResponseEntity.ok(applicationRepository.findAll());
    }
}
