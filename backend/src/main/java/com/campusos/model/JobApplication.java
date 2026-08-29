package com.campusos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "drive_id", nullable = false)
    private Long driveId;

    private String stage = "Applied";
    private String status = "In Process";

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "match_score")
    private Double matchScore = 75.0;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt = LocalDateTime.now();

    public JobApplication() {}

    public JobApplication(Long studentId, Long driveId, String stage, String status, Double matchScore) {
        this.studentId = studentId;
        this.driveId = driveId;
        this.stage = stage;
        this.status = status;
        this.matchScore = matchScore;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}
