package com.campusos.controller;

import com.campusos.engine.ResumeATSEngine;
import com.campusos.model.ResumeAnalysis;
import com.campusos.repository.ResumeAnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private ResumeAnalysisRepository resumeRepository;

    @Autowired
    private ResumeATSEngine atsEngine;

    public static class ResumeRequest {
        public String resume_text;
        public String resumeText;
        public String target_role;
        public String targetRole;
        public Long student_id;
        public Long studentId;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@RequestBody ResumeRequest req) {
        String text = req != null && req.resume_text != null ? req.resume_text :
                     (req != null && req.resumeText != null ? req.resumeText : "");
        String role = req != null && req.target_role != null ? req.target_role :
                     (req != null && req.targetRole != null ? req.targetRole : "Software Engineer");
        Long sId = req != null && req.student_id != null ? req.student_id :
                  (req != null && req.studentId != null ? req.studentId : 1L);

        ResumeATSEngine.AtsResult res = atsEngine.analyzeResume(text, role);

        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setStudentId(sId);
        analysis.setResumeText(text);
        analysis.setTargetRole(role);
        analysis.setAtsScore(res.score);
        analysis.setMatchedSkills(String.join(", ", res.matchedSkills));
        analysis.setMissingSkills(String.join(", ", res.missingSkills));
        analysis.setSuggestions(res.suggestions);

        resumeRepository.save(analysis);

        Map<String, Object> map = new HashMap<>();
        map.put("id", analysis.getId());
        map.put("student_id", sId);
        map.put("studentId", sId);
        map.put("ats_score", res.score);
        map.put("atsScore", res.score);
        map.put("target_role", role);
        map.put("targetRole", role);
        map.put("matched_skills", res.matchedSkills);
        map.put("matchedSkills", res.matchedSkills);
        map.put("missing_skills", res.missingSkills);
        map.put("missingSkills", res.missingSkills);
        map.put("suggestions", res.suggestions);

        return ResponseEntity.ok(map);
    }
}
