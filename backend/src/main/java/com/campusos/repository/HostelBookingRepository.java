package com.campusos.repository;

import com.campusos.model.HostelBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostelBookingRepository extends JpaRepository<HostelBooking, Long> {
    List<HostelBooking> findByStudentId(Long studentId);
}
