package com.campusos.repository;

import com.campusos.model.LabBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabBookingRepository extends JpaRepository<LabBooking, Long> {
    List<LabBooking> findByStudentId(Long studentId);
}
