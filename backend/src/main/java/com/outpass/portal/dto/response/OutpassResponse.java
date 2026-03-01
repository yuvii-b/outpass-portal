package com.outpass.portal.dto.response;

import com.outpass.portal.model.enums.OutpassStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OutpassResponse {
    private Long id;
    private String name;
    private String rollNo;
    private String department;
    private String hostel;
    private String roomNumber;
    private LocalDateTime date;
    private LocalDateTime returnDate;
    private Integer noOfDays;
    private String placeOfVisit;
    private String contactNumber;
    private String parentNumber;
    private OutpassStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

