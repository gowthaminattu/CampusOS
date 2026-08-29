package com.campusos.engine;

import com.campusos.model.StudentSkill;
import com.campusos.model.User;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class EmployabilityEngine {

    public static class CategoryScore {
        public String category;
        public Double score;
        public Double weight;

        public CategoryScore(String category, Double score, Double weight) {
            this.category = category;
            this.score = score;
            this.weight = weight;
        }
    }

    public static class EmployabilityResult {
        public Double overallScore;
        public String readinessTier;
        public List<CategoryScore> breakdown;
        public List<String> strengths;
        public List<String> weaknesses;
        public List<String> recommendations;
    }

    public EmployabilityResult calculateEmployability(User user, List<StudentSkill> skills, Double mockInterviewScore, Double atsScore) {
        double gpaScore = (user.getGpa() != null) ? Math.min(100.0, (user.getGpa() / 10.0) * 100.0) : 70.0;
        double attendanceScore = (user.getAttendance() != null) ? user.getAttendance() : 75.0;

        double techSkillScore = getAverageSkillScore(skills, "Technical", 72.0);
        double codingScore = getAverageSkillScore(skills, "Coding", 68.0);
        double aptitudeScore = getAverageSkillScore(skills, "Aptitude", 74.0);
        double commScore = getAverageSkillScore(skills, "Soft", 80.0);

        double mockScore = (mockInterviewScore != null && mockInterviewScore > 0) ? mockInterviewScore : 75.0;
        double resumeScore = (atsScore != null && atsScore > 0) ? atsScore : 75.0;
        double projectScore = 80.0; // default for hands-on projects

        List<CategoryScore> breakdown = Arrays.asList(
                new CategoryScore("Academic Performance (CGPA)", gpaScore, 0.15),
                new CategoryScore("Attendance Percentage", attendanceScore, 0.10),
                new CategoryScore("Technical Skills Matrix", techSkillScore, 0.15),
                new CategoryScore("Coding & Problem Solving", codingScore, 0.15),
                new CategoryScore("Aptitude & Reasoning", aptitudeScore, 0.10),
                new CategoryScore("Communication Skills", commScore, 0.10),
                new CategoryScore("Mock Interview Rating", mockScore, 0.10),
                new CategoryScore("Resume ATS Rating", resumeScore, 0.05),
                new CategoryScore("Hands-on Projects", projectScore, 0.10)
        );

        double overall = 0.0;
        for (CategoryScore cs : breakdown) {
            overall += cs.score * cs.weight;
        }
        overall = Math.round(overall * 10.0) / 10.0;

        String tier;
        if (overall < 40) tier = "Needs Improvement";
        else if (overall < 60) tier = "Developing";
        else if (overall < 75) tier = "Almost Ready";
        else if (overall < 90) tier = "Placement Ready";
        else tier = "Highly Competitive";

        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();
        List<String> recs = new ArrayList<>();

        if (gpaScore >= 80) strengths.add("Strong Academic Standing (CGPA " + user.getGpa() + ")");
        else weaknesses.add("CGPA needs improvement to meet top recruiter cutoffs");

        if (codingScore >= 75) strengths.add("Solid Data Structures & Algorithms foundation");
        else {
            weaknesses.add("Coding & DSA score below placement competitive threshold");
            recs.add("Practice 3-5 Medium LeetCode/HackerRank DSA problems weekly");
        }

        if (commScore >= 75) strengths.add("Excellent verbal & written communication skills");

        if (recs.isEmpty()) {
            recs.add("Complete an adaptive AI Mock Interview session to refine STAR response format");
            recs.add("Apply to active campus recruitment drives matching your skill profile");
        }

        EmployabilityResult res = new EmployabilityResult();
        res.overallScore = overall;
        res.readinessTier = tier;
        res.breakdown = breakdown;
        res.strengths = strengths;
        res.weaknesses = weaknesses;
        res.recommendations = recs;

        return res;
    }

    private double getAverageSkillScore(List<StudentSkill> skills, String category, double fallback) {
        if (skills == null || skills.isEmpty()) return fallback;
        double sum = 0;
        int count = 0;
        for (StudentSkill s : skills) {
            if (category.equalsIgnoreCase(s.getCategory())) {
                sum += s.getScore();
                count++;
            }
        }
        return count > 0 ? (sum / count) : fallback;
    }
}
