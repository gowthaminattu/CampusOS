package com.campusos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admissions")
public class AdmissionApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String dob;
    private String gender;
    private String email;
    private String phone;
    private String address;
    private String department;

    @Column(name = "marks_10th")
    private Double marks10th;

    @Column(name = "marks_12th")
    private Double marks12th;

    private String status = "Pending";

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt = LocalDateTime.now();

    public AdmissionApplication() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Double getMarks10th() { return marks10th; }
    public void setMarks10th(Double marks10th) { this.marks10th = marks10th; }

    public Double getMarks12th() { return marks12th; }
    public void setMarks12th(Double marks12th) { this.marks12th = marks12th; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
