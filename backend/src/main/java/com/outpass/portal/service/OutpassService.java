package com.outpass.portal.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.outpass.portal.dto.request.OutpassRequest;
import com.outpass.portal.dto.response.OutpassResponse;
import com.outpass.portal.model.entity.Outpass;
import com.outpass.portal.model.entity.Student;
import com.outpass.portal.model.enums.OutpassStatus;
import com.outpass.portal.repository.OutpassRepository;
import com.outpass.portal.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OutpassService {

    private final OutpassRepository outpassRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public OutpassResponse createOutpass(Long studentId, OutpassRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (request.getReturnDate().isBefore(request.getDate())) {
            throw new RuntimeException("Return date must be after departure date");
        }

        Outpass outpass = Outpass.builder()
                .student(student)
                .name(student.getName())
                .rollNo(student.getRollNo())
                .department(student.getDepartment())
                .hostel(student.getHostel())
                .roomNumber(student.getRoomNumber())
                .date(request.getDate())
                .returnDate(request.getReturnDate())
                .noOfDays(request.getNoOfDays())
                .placeOfVisit(request.getPlaceOfVisit())
                .contactNumber(request.getContactNumber())
                .parentNumber(request.getParentNumber())
                .status(OutpassStatus.PENDING)
                .build();

        Outpass saved = outpassRepository.save(outpass);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public OutpassResponse getOutpassById(Long outpassId, Long studentId) {
        Outpass outpass = outpassRepository.findById(outpassId)
                .orElseThrow(() -> new RuntimeException("Outpass not found"));

        if (studentId != null && !outpass.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Access denied");
        }

        return mapToResponse(outpass);
    }

    @Transactional(readOnly = true)
    public List<OutpassResponse> getStudentOutpasses(Long studentId) {
        return outpassRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OutpassResponse> getPendingOutpasses() {
        return outpassRepository.findByStatusOrderByCreatedAtDesc(OutpassStatus.PENDING)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OutpassResponse> getPendingOutpassesByHostel(String hostel) {
        return outpassRepository.findByHostelAndStatusOrderByCreatedAtDesc(hostel, OutpassStatus.PENDING)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OutpassResponse> getAllOutpassesByHostel(String hostel) {
        return outpassRepository.findByHostelOrderByCreatedAtDesc(hostel)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OutpassResponse approveOutpass(Long outpassId, String wardenHostel) {
        Outpass outpass = outpassRepository.findById(outpassId)
                .orElseThrow(() -> new RuntimeException("Outpass not found"));

        if (outpass.getStatus() != OutpassStatus.PENDING) {
            throw new RuntimeException("Only pending outpasses can be approved");
        }

        if (!outpass.getHostel().equals(wardenHostel)) {
            throw new RuntimeException("You can only approve outpasses from your own hostel");
        }

        outpass.setStatus(OutpassStatus.APPROVED);
        Outpass updated = outpassRepository.save(outpass);
        return mapToResponse(updated);
    }

    @Transactional
    public OutpassResponse declineOutpass(Long outpassId, String wardenHostel) {
        Outpass outpass = outpassRepository.findById(outpassId)
                .orElseThrow(() -> new RuntimeException("Outpass not found"));

        if (outpass.getStatus() != OutpassStatus.PENDING) {
            throw new RuntimeException("Only pending outpasses can be declined");
        }

        if (!outpass.getHostel().equals(wardenHostel)) {
            throw new RuntimeException("You can only decline outpasses from your own hostel");
        }

        outpass.setStatus(OutpassStatus.DECLINED);
        Outpass updated = outpassRepository.save(outpass);
        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<OutpassResponse> getActiveOutpasses() {
        LocalDateTime now = LocalDateTime.now();
        return outpassRepository.findByStatusOrderByCreatedAtDesc(OutpassStatus.APPROVED)
                .stream()
                .filter(o -> o.getDate().isBefore(now) && o.getReturnDate().isAfter(now))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OutpassResponse> getActiveOutpassesByHostel(String hostel) {
        LocalDateTime now = LocalDateTime.now();
        return outpassRepository.findByHostelAndStatusOrderByCreatedAtDesc(hostel, OutpassStatus.APPROVED)
                .stream()
                .filter(o -> o.getDate().isBefore(now) && o.getReturnDate().isAfter(now))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OutpassResponse> getTodayOutpasses() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

        return outpassRepository.findByDateBetween(startOfDay, endOfDay)
                .stream()
                .filter(o -> o.getStatus() == OutpassStatus.APPROVED)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OutpassResponse> getTodayOutpassesByHostel(String hostel) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

        return outpassRepository.findByHostelAndDateBetween(hostel, startOfDay, endOfDay)
                .stream()
                .filter(o -> o.getStatus() == OutpassStatus.APPROVED)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OutpassResponse getOutpassByIdAndHostel(Long id, String hostel) {
        Outpass outpass = outpassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Outpass not found"));
        
        if (hostel != null && !outpass.getHostel().equals(hostel)) {
            throw new RuntimeException("You can only view outpasses from your own hostel");
        }
        
        return mapToResponse(outpass);
    }

    private OutpassResponse mapToResponse(Outpass outpass) {
        return OutpassResponse.builder()
                .id(outpass.getId())
                .name(outpass.getName())
                .rollNo(outpass.getRollNo())
                .department(outpass.getDepartment())
                .hostel(outpass.getHostel())
                .roomNumber(outpass.getRoomNumber())
                .date(outpass.getDate())
                .returnDate(outpass.getReturnDate())
                .noOfDays(outpass.getNoOfDays())
                .placeOfVisit(outpass.getPlaceOfVisit())
                .contactNumber(outpass.getContactNumber())
                .parentNumber(outpass.getParentNumber())
                .status(outpass.getStatus())
                .createdAt(outpass.getCreatedAt())
                .updatedAt(outpass.getUpdatedAt())
                .build();
    }
}


