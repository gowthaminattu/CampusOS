package com.campusos.engine;

import com.campusos.model.StudentSkill;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class SkillGapEngine {

    public static class SkillGapResult {
        public String targetRole;
        public Double matchPercentage;
        public List<String> matchedSkills;
        public List<String> criticalGaps;
        public List<String> highPriorityGaps;
        public List<LearningWeek> learningSequence;
    }

    public static class LearningWeek {
        public Integer week;
        public String title;
        public String focus;
        public List<String> topics;
        public String projectTask;

        public LearningWeek(Integer week, String title, String focus, List<String> topics, String projectTask) {
            this.week = week;
            this.title = title;
            this.focus = focus;
            this.topics = topics;
            this.projectTask = projectTask;
        }
    }

    private static final Map<String, List<String>> ROLE_BENCHMARKS = Map.of(
            "Java Developer", List.of("Java", "OOP", "DSA", "SQL", "Spring Boot", "REST API", "Git", "System Design"),
            "Full Stack Developer", List.of("JavaScript", "React", "Node.js", "HTML/CSS", "SQL", "REST API", "Git", "TypeScript"),
            "Data Analyst", List.of("Python", "SQL", "Excel", "PowerBI", "Tableau", "Statistics", "Pandas", "Data Visualization"),
            "Cloud & DevOps Engineer", List.of("Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Git", "Python", "Networking"),
            "AI/ML Engineer", List.of("Python", "TensorFlow", "PyTorch", "Linear Algebra", "Machine Learning", "NLP", "SQL", "Deep Learning")
    );

    public SkillGapResult evaluateSkillGap(String targetRole, List<StudentSkill> studentSkills) {
        String roleKey = ROLE_BENCHMARKS.keySet().stream()
                .filter(r -> r.equalsIgnoreCase(targetRole))
                .findFirst().orElse("Java Developer");

        List<String> required = ROLE_BENCHMARKS.getOrDefault(roleKey, ROLE_BENCHMARKS.get("Java Developer"));

        Set<String> verifiedSkills = new HashSet<>();
        if (studentSkills != null) {
            for (StudentSkill s : studentSkills) {
                if (s.getScore() != null && s.getScore() >= 60.0) {
                    verifiedSkills.add(s.getSkillName().toLowerCase());
                }
            }
        }

        List<String> matched = new ArrayList<>();
        List<String> gaps = new ArrayList<>();

        for (String req : required) {
            if (verifiedSkills.contains(req.toLowerCase())) {
                matched.add(req);
            } else {
                gaps.add(req);
            }
        }

        double matchPct = Math.round(((double) matched.size() / required.size()) * 100.0 * 10.0) / 10.0;

        List<String> criticalGaps = gaps.subList(0, Math.min(2, gaps.size()));
        List<String> highPriorityGaps = gaps.size() > 2 ? gaps.subList(2, gaps.size()) : new ArrayList<>();

        List<LearningWeek> sequence = generate8WeekSequence(roleKey, gaps);

        SkillGapResult res = new SkillGapResult();
        res.targetRole = roleKey;
        res.matchPercentage = matchPct;
        res.matchedSkills = matched;
        res.criticalGaps = criticalGaps;
        res.highPriorityGaps = highPriorityGaps;
        res.learningSequence = sequence;

        return res;
    }

    private List<LearningWeek> generate8WeekSequence(String role, List<String> gaps) {
        List<LearningWeek> weeks = new ArrayList<>();
        String gap1 = !gaps.isEmpty() ? gaps.get(0) : "Advanced OOP & Clean Architecture";
        String gap2 = gaps.size() > 1 ? gaps.get(1) : "Microservices Architecture";

        weeks.add(new LearningWeek(1, "Core Foundation Refresher", gap1, List.of("Syntax Mastery", "Core Principles", "Best Practices"), "Build simple CLI project using " + gap1));
        weeks.add(new LearningWeek(2, "Data Structures & Algorithmic Optimization", "DSA & Complexity Analysis", List.of("Trees & Graphs", "Dynamic Programming", "Recursion"), "Solve 10 LeetCode Medium DSA problems"));
        weeks.add(new LearningWeek(3, "Database Design & Indexing", "SQL & Relational DBs", List.of("Complex Joins", "Indexing Strategy", "Query Optimization"), "Design schema with 5 relational tables"));
        weeks.add(new LearningWeek(4, "Backend & Microservices API Engineering", gap2, List.of("REST Controller Design", "JWT Authentication", "Error Handling"), "Build authenticated REST API backend"));
        weeks.add(new LearningWeek(5, "Frontend Integration & State Management", "SPA Architecture", List.of("Component Design", "Axios Interceptors", "State Hooks"), "Connect React UI with Spring Boot APIs"));
        weeks.add(new LearningWeek(6, "System Design & Distributed Systems", "Scalability Basics", List.of("Caching Strategies", "Load Balancing", "DB Sharding"), "Draw HLD architectural diagram"));
        weeks.add(new LearningWeek(7, "Cloud Deployment & CI/CD Pipelines", "DevOps & Docker", List.of("Dockerfile Containerization", "GitHub Actions CI", "Environment Vars"), "Deploy full-stack project container"));
        weeks.add(new LearningWeek(8, "Mock Interview & Technical Polishing", "Recruiter Readiness", List.of("STAR Interview Prep", "Resume Keyword ATS Match", "Live Coding"), "Complete adaptive mock interview evaluation"));

        return weeks;
    }
}
