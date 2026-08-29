package com.campusos.engine;

import com.campusos.model.JobDrive;
import com.campusos.model.User;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class EligibilityEngine {

    public static class EligibilityCheckResult {
        public User student;
        public boolean isEligible;
        public List<String> passReasons = new ArrayList<>();
        public List<String> failureReasons = new ArrayList<>();
    }

    public EligibilityCheckResult evaluateEligibility(User student, JobDrive drive) {
        EligibilityCheckResult res = new EligibilityCheckResult();
        res.student = student;
        boolean eligible = true;

        // 1. CGPA Cutoff
        double studentGpa = student.getGpa() != null ? student.getGpa() : 0.0;
        if (studentGpa >= drive.getMinCgpa()) {
            res.passReasons.add("CGPA " + studentGpa + " meets minimum requirement (" + drive.getMinCgpa() + ")");
        } else {
            eligible = false;
            res.failureReasons.add("CGPA " + studentGpa + " is below cutoff (" + drive.getMinCgpa() + ")");
        }

        // 2. Backlogs / Arrears
        int studentArrears = student.getArrears() != null ? student.getArrears() : 0;
        if (studentArrears <= drive.getMaxBacklogs()) {
            res.passReasons.add("Active backlogs (" + studentArrears + ") within allowed maximum (" + drive.getMaxBacklogs() + ")");
        } else {
            eligible = false;
            res.failureReasons.add("Active backlogs (" + studentArrears + ") exceed maximum limit (" + drive.getMaxBacklogs() + ")");
        }

        // 3. Allowed Branches
        String dept = student.getDepartment() != null ? student.getDepartment().trim().toUpperCase() : "";
        String allowed = drive.getAllowedBranches() != null ? drive.getAllowedBranches().toUpperCase() : "";
        List<String> allowedList = Arrays.asList(allowed.split("\\s*,\\s*"));

        if (allowedList.contains(dept) || allowed.contains("ALL") || allowed.isEmpty()) {
            res.passReasons.add("Department (" + dept + ") is eligible");
        } else {
            eligible = false;
            res.failureReasons.add("Department (" + dept + ") is not in allowed branches (" + drive.getAllowedBranches() + ")");
        }

        res.isEligible = eligible;
        return res;
    }
}
