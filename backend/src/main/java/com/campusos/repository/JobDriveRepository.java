package com.campusos.repository;

import com.campusos.model.JobDrive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobDriveRepository extends JpaRepository<JobDrive, Long> {
    List<JobDrive> findByStatus(String status);
}
