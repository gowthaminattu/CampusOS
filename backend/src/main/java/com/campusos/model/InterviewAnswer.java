package com.campusos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "interview_answers")
public class InterviewAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "interview_id", nullable = false)
    private Long interviewId;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(length = 2000, nullable = false)
    private String question;

    @Column(length = 4000, nullable = false)
    private String studentAnswer;

    @Column(length = 2000)
    private String aiEvaluation;

    private Double score = 70.0;
    private String difficulty = "Medium";

    public InterviewAnswer() {}

    public InterviewAnswer(Long interviewId, Integer questionNumber, String question, String studentAnswer, String aiEvaluation, Double score, String difficulty) {
        this.interviewId = interviewId;
        this.questionNumber = questionNumber;
        this.question = question;
        this.studentAnswer = studentAnswer;
        this.aiEvaluation = aiEvaluation;
        this.score = score;
        this.difficulty = difficulty;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getInterviewId() { return interviewId; }
    public void setInterviewId(Long interviewId) { this.interviewId = interviewId; }

    public Integer getQuestionNumber() { return questionNumber; }
    public void setQuestionNumber(Integer questionNumber) { this.questionNumber = questionNumber; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getStudentAnswer() { return studentAnswer; }
    public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }

    public String getAiEvaluation() { return aiEvaluation; }
    public void setAiEvaluation(String aiEvaluation) { this.aiEvaluation = aiEvaluation; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
}
