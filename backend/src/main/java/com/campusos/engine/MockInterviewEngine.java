package com.campusos.engine;

import com.campusos.model.InterviewAnswer;
import com.campusos.model.MockInterview;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class MockInterviewEngine {

    private static final Map<String, List<String>> QUESTION_BANKS = Map.of(
            "Java Developer", List.of(
                    "Explain the internal working of HashMap in Java. How are hash collisions resolved in Java 8?",
                    "What is the difference between fail-fast and fail-safe iterators in Java Collections?",
                    "How does Spring Boot Dependency Injection work under the hood? Explain @Autowired and Bean Lifecycles.",
                    "Explain Java Memory Model (JVM Heap vs Stack) and Garbage Collection generational algorithms."
            ),
            "Software Engineer", List.of(
                    "How would you design a rate limiter service for a high-traffic REST API?",
                    "Explain the difference between SQL indexing B-Trees and Hash indexes.",
                    "What is idempotency in RESTful API design, and how do you achieve it?",
                    "Explain Thread Concurrency issues: Race Conditions, Deadlocks, and Mutex Locks."
            )
    );

    public String getNextQuestion(String role, String currentDifficulty, int questionIndex) {
        List<String> questions = QUESTION_BANKS.getOrDefault(role, QUESTION_BANKS.get("Java Developer"));
        int idx = (questionIndex - 1) % questions.size();
        return questions.get(idx);
    }

    public Double evaluateAnswer(String question, String answer, String difficulty) {
        if (answer == null || answer.trim().length() < 10) {
            return 45.0;
        }

        double baseScore = 70.0;
        int wordCount = answer.trim().split("\\s+").length;
        if (wordCount > 30) baseScore += 10.0;
        if (wordCount > 60) baseScore += 8.0;

        String lower = answer.toLowerCase();
        if (lower.contains("for example") || lower.contains("instance") || lower.contains("specifically") || lower.contains("result")) {
            baseScore += 7.0; // STAR structure reward
        }

        return Math.min(98.0, baseScore);
    }

    public void updateReportCard(MockInterview interview, List<InterviewAnswer> answers) {
        if (answers == null || answers.isEmpty()) return;

        double sum = 0.0;
        for (InterviewAnswer a : answers) {
            sum += a.getScore();
        }
        double avg = Math.round((sum / answers.size()) * 10.0) / 10.0;

        interview.setOverallScore(avg);
        interview.setTechnicalAccuracy(Math.min(96.0, avg + 2.0));
        interview.setRelevanceScore(Math.min(95.0, avg + 1.0));
        interview.setCommunicationScore(Math.min(94.0, avg - 1.0));
        interview.setCompletenessScore(avg);
        interview.setConfidenceScore(Math.min(98.0, avg + 3.0));
        interview.setClarityScore(Math.min(95.0, avg));
        interview.setStatus("Completed");

        if (avg >= 85) {
            interview.setFeedback("Exceptional performance! Strong technical depth, structured STAR explanations, and clear architectural reasoning.");
        } else if (avg >= 70) {
            interview.setFeedback("Good performance! Solid domain knowledge with minor gaps in edge-case handling and system optimization.");
        } else {
            interview.setFeedback("Needs improvement. Focus on technical accuracy, avoiding brief surface answers, and illustrating concepts with concrete examples.");
        }
    }
}
