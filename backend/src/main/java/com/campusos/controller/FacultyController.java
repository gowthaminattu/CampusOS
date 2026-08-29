package com.campusos.controller;

import com.campusos.engine.AtRiskEngine;
import com.campusos.model.MockInterview;
import com.campusos.model.User;
import com.campusos.repository.MockInterviewRepository;
import com.campusos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MockInterviewRepository mockRepository;

    @Autowired
    private AtRiskEngine atRiskEngine;

    @GetMapping("/at-risk-students")
    public ResponseEntity<?> getAtRiskStudents() {
        List<User> students = userRepository.findByRole("student");
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (User s : students) {
            List<MockInterview> mocks = mockRepository.findByStudentId(s.getId());
            Double mockScore = mocks.isEmpty() ? 70.0 : mocks.get(mocks.size() - 1).getOverallScore();

            AtRiskEngine.AtRiskStudentInfo info = atRiskEngine.evaluateRisk(s, mockScore);

            Map<String, Object> map = new HashMap<>();
            map.put("student_id", s.getId());
            map.put("name", s.getName());
            map.put("roll_number", s.getRollNumber() != null ? s.getRollNumber() : "COS-2026-" + s.getId());
            map.put("department", s.getDepartment() != null ? s.getDepartment() : "Computer Science & Engineering");
            map.put("year", s.getYear() != null ? s.getYear() : 4);
            map.put("attendance", s.getAttendance() != null ? s.getAttendance() : 85.0);
            map.put("gpa", s.getGpa() != null ? s.getGpa() : 8.0);
            map.put("arrears", s.getArrears() != null ? s.getArrears() : 0);

            String levelUpper = info.riskLevel.toUpperCase();
            map.put("risk_level", levelUpper);

            String badgeColor = "#10b981"; // green for LOW
            if ("CRITICAL".equals(levelUpper)) badgeColor = "#ef4444"; // red
            else if ("HIGH".equals(levelUpper)) badgeColor = "#f97316"; // orange
            else if ("MEDIUM".equals(levelUpper)) badgeColor = "#f59e0b"; // yellow
            map.put("risk_badge_color", badgeColor);

            List<String> reasons = info.riskFactors.isEmpty() ?
                    List.of("No critical academic or placement risk factors detected.") : info.riskFactors;
            map.put("reasons", reasons);
            map.put("recommended_action", info.recommendedAction);

            responseList.add(map);
        }

        return ResponseEntity.ok(responseList);
    }
}
