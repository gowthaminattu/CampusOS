package com.campusos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "library_transactions")
public class LibraryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "book_id", nullable = false)
    private Long bookId;

    @Column(name = "issue_date", nullable = false)
    private String issueDate;

    @Column(name = "due_date", nullable = false)
    private String dueDate;

    @Column(name = "return_date")
    private String returnDate;

    @Column(name = "fine_amount")
    private Double fineAmount = 0.0;

    private String status = "Issued";

    public LibraryTransaction() {}

    public LibraryTransaction(Long studentId, Long bookId, String issueDate, String dueDate) {
        this.studentId = studentId;
        this.bookId = bookId;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getReturnDate() { return returnDate; }
    public void setReturnDate(String returnDate) { this.returnDate = returnDate; }

    public Double getFineAmount() { return fineAmount; }
    public void setFineAmount(Double fineAmount) { this.fineAmount = fineAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
