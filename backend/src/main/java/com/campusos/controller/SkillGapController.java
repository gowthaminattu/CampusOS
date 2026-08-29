package com.campusos.controller;

import com.campusos.engine.SkillGapEngine;
import com.campusos.model.StudentSkill;
import com.campusos.model.User;
import com.campusos.repository.StudentSkillRepository;
import com.campusos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/career")
public class SkillGapController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentSkillRepository skillRepository;

    @Autowired
    private SkillGapEngine skillGapEngine;

    public static class SkillGapRequest {
        public String target_role;
        public String targetRole;
        public Long student_id;
        public Long studentId;
    }

    @PostMapping("/skill-gap")
    public ResponseEntity<?> evaluateSkillGap(@RequestBody(required = false) SkillGapRequest req) {
        String role = req != null && req.target_role != null ? req.target_role :
                     (req != null && req.targetRole != null ? req.targetRole : "Java Developer");
        Long studentId = req != null && req.student_id != null ? req.student_id :
                        (req != null && req.studentId != null ? req.studentId : 1L);

        Optional<User> userOpt = userRepository.findById(studentId);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail("student@campusos.com");
        }

        List<StudentSkill> skills = new ArrayList<>();
        if (userOpt.isPresent()) {
            skills = skillRepository.findByStudentId(userOpt.get().getId());
        }

        SkillGapEngine.SkillGapResult result = skillGapEngine.evaluateSkillGap(role, skills);

        Map<String, Object> map = new HashMap<>();
        map.put("targetRole", result.targetRole);
        map.put("target_role", result.targetRole);
        map.put("matchPercentage", result.matchPercentage);
        map.put("match_percentage", result.matchPercentage);
        map.put("matchedSkills", result.matchedSkills);
        map.put("matched_skills", result.matchedSkills);
        map.put("criticalGaps", result.criticalGaps);
        map.put("critical_gaps", result.criticalGaps);
        map.put("highPriorityGaps", result.highPriorityGaps);
        map.put("high_priority_gaps", result.highPriorityGaps);
        map.put("learningSequence", result.learningSequence);
        map.put("learning_sequence", result.learningSequence);

        return ResponseEntity.ok(map);
    }
}
