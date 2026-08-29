package com.campusos.engine;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class ResumeATSEngine {

    public static class AtsResult {
        public Double score;
        public List<String> matchedSkills;
        public List<String> missingSkills;
        public String suggestions;
    }

    private static final List<String> KEYWORDS = List.of(
            "Java", "Spring Boot", "REST API", "SQL", "PostgreSQL", "Docker", "Git", "DSA",
            "Microservices", "Python", "React", "JavaScript", "AWS", "CI/CD", "Unit Testing", "System Design"
    );

    public AtsResult analyzeResume(String resumeText, String targetRole) {
        String textLower = resumeText.toLowerCase();
        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String kw : KEYWORDS) {
            if (textLower.contains(kw.toLowerCase())) {
                matched.add(kw);
            } else {
                missing.add(kw);
            }
        }

        double score = Math.round(((double) matched.size() / KEYWORDS.size()) * 100.0 * 10.0) / 10.0;
        score = Math.max(55.0, Math.min(95.0, score + 20.0));

        AtsResult res = new AtsResult();
        res.score = score;
        res.matchedSkills = matched;
        res.missingSkills = missing.subList(0, Math.min(5, missing.size()));
        res.suggestions = "Add quantified metrics (e.g. 'Improved API performance by 40%') and explicitly include missing keywords: " + String.join(", ", res.missingSkills);

        return res;
    }
}
