package com.campusos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mock_interviews")
public class MockInterview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "target_role", nullable = false)
    private String targetRole;

    private String difficulty = "Medium";

    @Column(name = "overall_score")
    private Double overallScore = 0.0;

    @Column(name = "technical_accuracy")
    private Double technicalAccuracy = 0.0;

    @Column(name = "relevance_score")
    private Double relevanceScore = 0.0;

    @Column(name = "communication_score")
    private Double communicationScore = 0.0;

    @Column(name = "completeness_score")
    private Double completenessScore = 0.0;

    @Column(name = "confidence_score")
    private Double confidenceScore = 0.0;

    @Column(name = "clarity_score")
    private Double clarityScore = 0.0;

    private String status = "Completed";

    @Column(length = 2000)
    private String feedback;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public MockInterview() {}

    public MockInterview(Long studentId, String targetRole, String difficulty) {
        this.studentId = studentId;
        this.targetRole = targetRole;
        this.difficulty = difficulty;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Double getOverallScore() { return overallScore; }
    public void setOverallScore(Double overallScore) { this.overallScore = overallScore; }

    public Double getTechnicalAccuracy() { return technicalAccuracy; }
    public void setTechnicalAccuracy(Double technicalAccuracy) { this.technicalAccuracy = technicalAccuracy; }

    public Double getRelevanceScore() { return relevanceScore; }
    public void setRelevanceScore(Double relevanceScore) { this.relevanceScore = relevanceScore; }

    public Double getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(Double communicationScore) { this.communicationScore = communicationScore; }

    public Double getCompletenessScore() { return completenessScore; }
    public void setCompletenessScore(Double completenessScore) { this.completenessScore = completenessScore; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public Double getClarityScore() { return clarityScore; }
    public void setClarityScore(Double clarityScore) { this.clarityScore = clarityScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
