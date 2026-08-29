package com.campusos;

import com.campusos.engine.EligibilityEngine;
import com.campusos.engine.EmployabilityEngine;
import com.campusos.engine.MockInterviewEngine;
import com.campusos.engine.SkillGapEngine;
import com.campusos.model.JobDrive;
import com.campusos.model.StudentSkill;
import com.campusos.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CampusOSTests {

    @Autowired
    private EmployabilityEngine employabilityEngine;

    @Autowired
    private EligibilityEngine eligibilityEngine;

    @Autowired
    private SkillGapEngine skillGapEngine;

    @Autowired
    private MockInterviewEngine mockInterviewEngine;

    @Test
    void testEmployabilityCalculation() {
        User user = new User("Test Student", "test@campusos.com", "21CS099", "pass", "CSE", 4, "student");
        user.setGpa(8.5);
        user.setAttendance(90.0);
        user.setArrears(0);

        List<StudentSkill> skills = List.of(
                new StudentSkill(1L, "Java", "Technical", 85.0),
                new StudentSkill(1L, "DSA", "Coding", 75.0),
                new StudentSkill(1L, "Aptitude", "Aptitude", 80.0),
                new StudentSkill(1L, "Communication", "Soft", 85.0)
        );

        EmployabilityEngine.EmployabilityResult result = employabilityEngine.calculateEmployability(user, skills, 80.0, 85.0);

        assertNotNull(result);
        assertTrue(result.overallScore > 75.0);
        assertEquals("Placement Ready", result.readinessTier);
    }

    @Test
    void testEligibilityEngine() {
        User student = new User("Eligible Student", "eligible@campusos.com", "21CS100", "pass", "CSE", 4, "student");
        student.setGpa(8.2);
        student.setArrears(0);

        JobDrive drive = new JobDrive(1L, "Test Drive", "SDE", "Desc", 7.5, 0, "CSE,ECE,IT", "Java", 12.0, "Bangalore", "2026-09-01", "Active");

        EligibilityEngine.EligibilityCheckResult result = eligibilityEngine.evaluateEligibility(student, drive);

        assertTrue(result.isEligible);
        assertEquals(0, result.failureReasons.size());
    }

    @Test
    void testSkillGapEngine() {
        List<StudentSkill> skills = List.of(
                new StudentSkill(1L, "Java", "Technical", 80.0),
                new StudentSkill(1L, "OOP", "Technical", 85.0),
                new StudentSkill(1L, "SQL", "Technical", 75.0)
        );

        SkillGapEngine.SkillGapResult result = skillGapEngine.evaluateSkillGap("Java Developer", skills);

        assertNotNull(result);
        assertTrue(result.matchPercentage > 0);
        assertEquals(8, result.learningSequence.size());
    }

    @Test
    void testMockInterviewEngine() {
        String question = mockInterviewEngine.getNextQuestion("Java Developer", "Medium", 1);
        assertNotNull(question);

        Double score = mockInterviewEngine.evaluateAnswer(question, "HashMap uses array of buckets with linked lists and trees for resolving collisions.", "Medium");
        assertTrue(score >= 70.0);
    }
}
