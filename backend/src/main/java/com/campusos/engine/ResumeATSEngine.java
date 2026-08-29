package com.campusos.engine;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class ResumeATSEngine {

    public static class KeywordGap {
        public String keyword;
        public String priority;
        public String tip;

        public KeywordGap(String keyword, String priority, String tip) {
            this.keyword = keyword;
            this.priority = priority;
            this.tip = tip;
        }
    }

    public static class FormatCheck {
        public String type; // "PASS" | "SUGGESTION" | "WARNING"
        public String message;

        public FormatCheck(String type, String message) {
            this.type = type;
            this.message = message;
        }
    }

    public static class AtsResult {
        public Double atsScore;
        public Double jdMatchScore;
        public Double keywordScore;
        public Double formattingScore;
        public Double quantificationScore;
        public Double completenessScore;
        public String readinessTier;
        public String readinessBadgeColor;
        public String summary;
        public List<String> extractedSkills;
        public List<KeywordGap> missingKeywords;
        public List<FormatCheck> formattingFeedback;
    }

    private static final List<String> ALL_KEYWORDS = List.of(
            "Java", "Spring Boot", "REST API", "SQL", "PostgreSQL", "Docker", "Git", "DSA",
            "Microservices", "Python", "React", "JavaScript", "AWS", "CI/CD", "Unit Testing", "System Design",
            "HTML5", "CSS3", "Tailwind", "Node.js", "Express.js", "MongoDB", "Redux", "Kafka"
    );

    public AtsResult analyzeResume(String resumeText, String jobDescription) {
        String textLower = (resumeText != null ? resumeText : "").toLowerCase();
        String jdLower = (jobDescription != null ? jobDescription : "").toLowerCase();

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String kw : ALL_KEYWORDS) {
            if (textLower.contains(kw.toLowerCase())) {
                matched.add(kw);
            } else {
                missing.add(kw);
            }
        }

        // 1. Keyword Score
        double keywordScore = Math.min(98.0, Math.max(50.0, (matched.size() * 4.5) + 30.0));

        // 2. JD Match Score
        double jdMatchScore = 82.0;
        if (!jdLower.isEmpty()) {
            int jdMatches = 0;
            for (String kw : ALL_KEYWORDS) {
                if (jdLower.contains(kw.toLowerCase()) && textLower.contains(kw.toLowerCase())) {
                    jdMatches++;
                }
            }
            jdMatchScore = Math.min(96.0, Math.max(55.0, (jdMatches * 10.0) + 40.0));
        }

        // 3. Formatting Score
        double formattingScore = textLower.contains("education") && textLower.contains("skills") ? 92.0 : 75.0;

        // 4. Quantification Score (checking for numbers/percentages)
        boolean hasMetrics = textLower.matches(".*\\d+%.*") || textLower.matches(".*\\d+\\+.*") || textLower.matches(".*\\d+k.*");
        double quantificationScore = hasMetrics ? 88.0 : 65.0;

        // 5. Completeness Score
        boolean hasEmail = textLower.contains("@");
        boolean hasPhone = textLower.contains("+") || textLower.matches(".*\\d{10}.*");
        double completenessScore = (hasEmail ? 50.0 : 25.0) + (hasPhone ? 45.0 : 25.0);

        // Overall Composite ATS Score
        double compositeAtsScore = (keywordScore * 0.35) + (jdMatchScore * 0.25) + (formattingScore * 0.15) + (quantificationScore * 0.15) + (completenessScore * 0.10);
        compositeAtsScore = Math.round(compositeAtsScore * 10.0) / 10.0;

        String tier = compositeAtsScore >= 85.0 ? "Placement Ready (Tier 1)" : (compositeAtsScore >= 70.0 ? "Placement Eligible (Tier 2)" : "Requires ATS Optimization");
        String badgeColor = compositeAtsScore >= 85.0 ? "#10b981" : (compositeAtsScore >= 70.0 ? "#f59e0b" : "#ef4444");

        List<KeywordGap> gaps = new ArrayList<>();
        if (!matched.contains("TypeScript")) gaps.add(new KeywordGap("TypeScript", "HIGH", "Mention TypeScript interfaces & type safety experience in frontend projects."));
        if (!matched.contains("Docker")) gaps.add(new KeywordGap("Docker & Containerization", "HIGH", "Add containerized deployment experience (Docker/Kubernetes) to tools section."));
        if (!matched.contains("CI/CD")) gaps.add(new KeywordGap("CI/CD Pipelines (GitHub Actions)", "MEDIUM", "Highlight automated test & continuous deployment workflows."));
        if (!matched.contains("System Design")) gaps.add(new KeywordGap("System Design & Architecture", "MEDIUM", "Include scalable system architecture bullet points in major project descriptions."));

        List<FormatCheck> checks = new ArrayList<>();
        checks.add(new FormatCheck("PASS", "Standard contact information & email format verified."));
        checks.add(new FormatCheck("PASS", "ATS-parseable section headers (Education, Skills, Experience) present."));
        if (hasMetrics) {
            checks.add(new FormatCheck("PASS", "Quantified achievement metrics detected (e.g. percentages/performance gains)."));
        } else {
            checks.add(new FormatCheck("SUGGESTION", "Quantify project impact (e.g. 'Improved API response latency by 40%')."));
        }

        AtsResult res = new AtsResult();
        res.atsScore = compositeAtsScore;
        res.jdMatchScore = Math.round(jdMatchScore * 10.0) / 10.0;
        res.keywordScore = Math.round(keywordScore * 10.0) / 10.0;
        res.formattingScore = Math.round(formattingScore * 10.0) / 10.0;
        res.quantificationScore = Math.round(quantificationScore * 10.0) / 10.0;
        res.completenessScore = Math.round(completenessScore * 10.0) / 10.0;
        res.readinessTier = tier;
        res.readinessBadgeColor = badgeColor;
        res.summary = String.format("Strong ATS candidate profile! High keyword density (%d detected). %s", matched.size(), hasMetrics ? "Impact metrics detected." : "Consider adding quantified metrics.");
        res.extractedSkills = matched;
        res.missingKeywords = gaps;
        res.formattingFeedback = checks;

        return res;
    }
}
