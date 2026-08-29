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
        public String job_description;
        public String jobDescription;
        public String target_role;
        public String targetRole;
        public Long student_id;
        public Long studentId;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@RequestBody ResumeRequest req) {
        String text = req != null && req.resume_text != null ? req.resume_text :
                     (req != null && req.resumeText != null ? req.resumeText : "");
        String jd = req != null && req.job_description != null ? req.job_description :
                   (req != null && req.jobDescription != null ? req.jobDescription : "");
        String role = req != null && req.target_role != null ? req.target_role :
                     (req != null && req.targetRole != null ? req.targetRole : "Software Development Engineer");
        Long sId = req != null && req.student_id != null ? req.student_id :
                  (req != null && req.studentId != null ? req.studentId : 1L);

        ResumeATSEngine.AtsResult res = atsEngine.analyzeResume(text, jd);

        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setStudentId(sId);
        analysis.setResumeText(text);
        analysis.setTargetRole(role);
        analysis.setAtsScore(res.atsScore);
        analysis.setMatchedSkills(String.join(", ", res.extractedSkills));
        analysis.setMissingSkills(res.missingKeywords != null ? res.missingKeywords.stream().map(g -> g.keyword).reduce((a, b) -> a + ", " + b).orElse("") : "");
        analysis.setSuggestions(res.summary);

        resumeRepository.save(analysis);

        Map<String, Object> map = new HashMap<>();
        map.put("id", analysis.getId());
        map.put("student_id", sId);
        map.put("studentId", sId);
        map.put("ats_score", res.atsScore);
        map.put("atsScore", res.atsScore);
        map.put("jd_match_score", res.jdMatchScore);
        map.put("jdMatchScore", res.jdMatchScore);
        map.put("keyword_score", res.keywordScore);
        map.put("keywordScore", res.keywordScore);
        map.put("formatting_score", res.formattingScore);
        map.put("formattingScore", res.formattingScore);
        map.put("quantification_score", res.quantificationScore);
        map.put("quantificationScore", res.quantificationScore);
        map.put("completeness_score", res.completenessScore);
        map.put("completenessScore", res.completenessScore);
        map.put("readiness_tier", res.readinessTier);
        map.put("readinessTier", res.readinessTier);
        map.put("readiness_badge_color", res.readinessBadgeColor);
        map.put("readinessBadgeColor", res.readinessBadgeColor);
        map.put("target_role", role);
        map.put("targetRole", role);
        map.put("summary", res.summary);
        map.put("extracted_skills", res.extractedSkills);
        map.put("extractedSkills", res.extractedSkills);
        map.put("missing_keywords", res.missingKeywords);
        map.put("missingKeywords", res.missingKeywords);
        map.put("formatting_feedback", res.formattingFeedback);
        map.put("formattingFeedback", res.formattingFeedback);

        return ResponseEntity.ok(map);
    }
}
