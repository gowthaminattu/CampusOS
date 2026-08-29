package com.campusos.repository;

import com.campusos.model.LibraryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryTransactionRepository extends JpaRepository<LibraryTransaction, Long> {
    List<LibraryTransaction> findByStudentId(Long studentId);
}
