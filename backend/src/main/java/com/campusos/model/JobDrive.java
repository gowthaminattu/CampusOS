package com.campusos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_drives")
public class JobDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String role;

    @Column(length = 2000)
    private String description;

    @Column(name = "min_cgpa")
    private Double minCgpa = 6.0;

    @Column(name = "max_backlogs")
    private Integer maxBacklogs = 0;

    @Column(name = "allowed_branches")
    private String allowedBranches = "CSE,ECE,EEE,MECH,CIVIL,IT";

    @Column(name = "required_skills")
    private String requiredSkills;

    @Column(name = "package_lpa")
    private Double packageLpa = 5.0;

    private String location;

    @Column(name = "drive_date")
    private String driveDate;

    private String status = "Active";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public JobDrive() {}

    public JobDrive(Long companyId, String title, String role, String description, Double minCgpa, Integer maxBacklogs, String allowedBranches, String requiredSkills, Double packageLpa, String location, String driveDate, String status) {
        this.companyId = companyId;
        this.title = title;
        this.role = role;
        this.description = description;
        this.minCgpa = minCgpa;
        this.maxBacklogs = maxBacklogs;
        this.allowedBranches = allowedBranches;
        this.requiredSkills = requiredSkills;
        this.packageLpa = packageLpa;
        this.location = location;
        this.driveDate = driveDate;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }

    public Integer getMaxBacklogs() { return maxBacklogs; }
    public void setMaxBacklogs(Integer maxBacklogs) { this.maxBacklogs = maxBacklogs; }

    public String getAllowedBranches() { return allowedBranches; }
    public void setAllowedBranches(String allowedBranches) { this.allowedBranches = allowedBranches; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public Double getPackageLpa() { return packageLpa; }
    public void setPackageLpa(Double packageLpa) { this.packageLpa = packageLpa; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDriveDate() { return driveDate; }
    public void setDriveDate(String driveDate) { this.driveDate = driveDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
