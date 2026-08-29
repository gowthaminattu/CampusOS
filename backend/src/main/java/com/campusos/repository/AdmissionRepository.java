package com.campusos.repository;

import com.campusos.model.AdmissionApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdmissionRepository extends JpaRepository<AdmissionApplication, Long> {
    List<AdmissionApplication> findByStudentId(Long studentId);
}
