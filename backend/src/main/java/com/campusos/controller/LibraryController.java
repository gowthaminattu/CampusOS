package com.campusos.controller;

import com.campusos.model.LibraryBook;
import com.campusos.model.LibraryTransaction;
import com.campusos.repository.LibraryBookRepository;
import com.campusos.repository.LibraryTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    @Autowired
    private LibraryBookRepository bookRepository;

    @Autowired
    private LibraryTransactionRepository transactionRepository;

    public static class IssueRequest {
        public Long book_id;
        public Long student_id;
    }

    @GetMapping("/books")
    public ResponseEntity<?> getAllBooks() {
        return ResponseEntity.ok(bookRepository.findAll());
    }

    @PostMapping("/issue")
    public ResponseEntity<?> issueBook(@RequestBody IssueRequest req) {
        Long bId = req != null && req.book_id != null ? req.book_id : 1L;
        Long sId = req != null && req.student_id != null ? req.student_id : 1L;

        Optional<LibraryBook> bOpt = bookRepository.findById(bId);
        if (bOpt.isEmpty() || bOpt.get().getAvailableCopies() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("detail", "Book not available"));
        }

        LibraryBook book = bOpt.get();
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        LibraryTransaction tx = new LibraryTransaction(sId, bId, "2026-08-29", "2026-09-15");
        transactionRepository.save(tx);

        return ResponseEntity.ok(tx);
    }

    @GetMapping("/my-transactions")
    public ResponseEntity<?> getMyTransactions(@RequestParam(value = "student_id", required = false) Long studentId) {
        Long sId = studentId != null ? studentId : 1L;
        return ResponseEntity.ok(transactionRepository.findByStudentId(sId));
    }
}
