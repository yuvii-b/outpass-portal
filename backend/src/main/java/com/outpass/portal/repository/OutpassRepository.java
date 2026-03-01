package com.outpass.portal.repository;

import com.outpass.portal.model.entity.Outpass;
import com.outpass.portal.model.enums.OutpassStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OutpassRepository extends JpaRepository<Outpass, Long> {
    List<Outpass> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Outpass> findByStatusOrderByCreatedAtDesc(OutpassStatus status);
    List<Outpass> findByHostelAndStatusOrderByCreatedAtDesc(String hostel, OutpassStatus status);
    List<Outpass> findByDateBetween(LocalDateTime start, LocalDateTime end);
    long countByStudentIdAndStatus(Long studentId, OutpassStatus status);
}

