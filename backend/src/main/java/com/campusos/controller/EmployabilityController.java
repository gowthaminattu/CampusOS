package com.campusos.controller;

import com.campusos.engine.EmployabilityEngine;
import com.campusos.model.MockInterview;
import com.campusos.model.ResumeAnalysis;
import com.campusos.model.StudentSkill;
import com.campusos.model.User;
import com.campusos.repository.MockInterviewRepository;
import com.campusos.repository.ResumeAnalysisRepository;
import com.campusos.repository.StudentSkillRepository;
import com.campusos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/students")
public class EmployabilityController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentSkillRepository skillRepository;

    @Autowired
    private MockInterviewRepository mockRepository;

    @Autowired
    private ResumeAnalysisRepository resumeRepository;

    @Autowired
    private EmployabilityEngine employabilityEngine;

    @GetMapping("/{studentId}/employability")
    public ResponseEntity<?> getEmployability(@PathVariable Long studentId) {
        Optional<User> userOpt = userRepository.findById(studentId);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail("student@campusos.com");
        }
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User student = userOpt.get();
        List<StudentSkill> skills = skillRepository.findByStudentId(student.getId());

        List<MockInterview> mocks = mockRepository.findByStudentId(student.getId());
        Double mockScore = mocks.isEmpty() ? 75.0 : mocks.get(mocks.size() - 1).getOverallScore();

        List<ResumeAnalysis> resumes = resumeRepository.findByStudentId(student.getId());
        Double atsScore = resumes.isEmpty() ? 78.0 : resumes.get(resumes.size() - 1).getAtsScore();

        EmployabilityEngine.EmployabilityResult result = employabilityEngine.calculateEmployability(student, skills, mockScore, atsScore);

        Map<String, Object> map = new HashMap<>();
        map.put("overallScore", result.overallScore);
        map.put("overall_score", result.overallScore);
        map.put("readinessTier", result.readinessTier);
        map.put("readiness_tier", result.readinessTier);
        map.put("breakdown", result.breakdown);
        map.put("strengths", result.strengths);
        map.put("weaknesses", result.weaknesses);
        map.put("recommendations", result.recommendations);

        return ResponseEntity.ok(map);
    }
}
