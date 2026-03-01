package com.outpass.portal.model.entity;

import com.outpass.portal.model.enums.OutpassStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "outpasses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Outpass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id",  nullable = false)
    private Student student;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Roll number is required")
    @Size(max = 10, message = "Roll number cannot exceed 10 characters")
    @Column(name = "roll_no", nullable = false, length = 10)
    private String rollNo;

    @NotBlank(message = "Department is required")
    @Column(nullable = false)
    private String department;

    @NotBlank(message = "Hostel is required")
    @Column(nullable = false)
    private String hostel;

    @NotBlank(message = "Room number is required")
    @Column(name = "room_number", nullable = false)
    private String roomNumber;

    @NotNull(message = "Date of leaving is required")
    @Column(nullable = false)
    private LocalDateTime date;

    @NotNull(message = "Return date is required")
    @Column(name = "return_date", nullable = false)
    private LocalDateTime returnDate;

    @NotNull(message = "Number of days is required")
    @Column(name = "num_of_days", nullable = false)
    private Integer noOfDays;

    @NotBlank(message = "Place of visit is required")
    @Column(name = "visit_place", nullable = false)
    private String placeOfVisit;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "\\d{10}", message = "Contact number must be 10 digits")
    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @NotBlank(message = "Parent contact number is required")
    @Pattern(regexp = "\\d{10}", message = "Parent contact number must be 10 digits")
    @Column(name = "parent_number", nullable = false)
    private String parentNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OutpassStatus status = OutpassStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
