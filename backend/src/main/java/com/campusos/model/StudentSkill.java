package com.campusos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "student_skills")
public class StudentSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "skill_name", nullable = false)
    private String skillName;

    private String category = "Technical";

    private Double score = 70.0;

    public StudentSkill() {}

    public StudentSkill(Long studentId, String skillName, String category, Double score) {
        this.studentId = studentId;
        this.skillName = skillName;
        this.category = category;
        this.score = score;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
}
