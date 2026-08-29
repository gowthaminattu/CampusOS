package com.campusos.engine;

import com.campusos.model.User;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class AtRiskEngine {

    public static class AtRiskStudentInfo {
        public User student;
        public String riskLevel; // Low, Medium, High, Critical
        public List<String> riskFactors;
        public String recommendedAction;
    }

    public AtRiskStudentInfo evaluateRisk(User student, Double mockScore) {
        List<String> factors = new ArrayList<>();
        int riskPoints = 0;

        double attendance = student.getAttendance() != null ? student.getAttendance() : 85.0;
        double gpa = student.getGpa() != null ? student.getGpa() : 8.0;
        int arrears = student.getArrears() != null ? student.getArrears() : 0;
        double mock = mockScore != null ? mockScore : 75.0;

        if (attendance < 75.0) {
            riskPoints += 3;
            factors.add("Attendance below 75% cutoff (" + attendance + "%)");
        } else if (attendance < 80.0) {
            riskPoints += 1;
            factors.add("Attendance in warning zone (" + attendance + "%)");
        }

        if (gpa < 6.5) {
            riskPoints += 3;
            factors.add("CGPA below 6.5 cutoff (" + gpa + ")");
        } else if (gpa < 7.2) {
            riskPoints += 1;
            factors.add("CGPA below average (" + gpa + ")");
        }

        if (arrears > 2) {
            riskPoints += 4;
            factors.add("High active backlogs count (" + arrears + ")");
        } else if (arrears > 0) {
            riskPoints += 2;
            factors.add("Active backlog present (" + arrears + ")");
        }

        if (mock < 50.0) {
            riskPoints += 2;
            factors.add("Low mock interview performance (" + mock + ")");
        }

        String level;
        String action;

        if (riskPoints >= 6) {
            level = "Critical";
            action = "Mandatory 1-on-1 Faculty Counseling & Remedial Coaching Session";
        } else if (riskPoints >= 4) {
            level = "High";
            action = "Assign Academic Mentor & Academic Recovery Plan";
        } else if (riskPoints >= 2) {
            level = "Medium";
            action = "Issue Advisory Alert to Student & Department Head";
        } else {
            level = "Low";
            action = "Regular Monthly Monitoring";
        }

        AtRiskStudentInfo info = new AtRiskStudentInfo();
        info.student = student;
        info.riskLevel = level;
        info.riskFactors = factors;
        info.recommendedAction = action;

        return info;
    }
}
