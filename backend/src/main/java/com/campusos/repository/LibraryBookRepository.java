package com.campusos.repository;

import com.campusos.model.LibraryBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LibraryBookRepository extends JpaRepository<LibraryBook, Long> {
    Optional<LibraryBook> findByIsbn(String isbn);
}
