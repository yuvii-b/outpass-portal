package com.outpass.portal.controller;

import com.outpass.portal.dto.request.OutpassRequest;
import com.outpass.portal.dto.request.StudentProfileUpdateRequest;
import com.outpass.portal.dto.response.ApiResponse;
import com.outpass.portal.dto.response.OutpassResponse;
import com.outpass.portal.dto.response.StudentProfileResponse;
import com.outpass.portal.security.UserPrincipal;
import com.outpass.portal.service.OutpassService;
import com.outpass.portal.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final OutpassService outpassService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        StudentProfileResponse profile = studentService.getProfile(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody StudentProfileUpdateRequest updateRequest) {
        StudentProfileResponse updated = studentService.updateProfile(userPrincipal.getId(), updateRequest);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PostMapping("/outpass")
    public ResponseEntity<ApiResponse<OutpassResponse>> createOutpass(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody OutpassRequest request) {
        OutpassResponse outpass = outpassService.createOutpass(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Outpass created successfully", outpass));
    }

    @GetMapping("/outpass/history")
    public ResponseEntity<ApiResponse<List<OutpassResponse>>> getOutpassHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<OutpassResponse> history = outpassService.getStudentOutpasses(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/outpass/{id}")
    public ResponseEntity<ApiResponse<OutpassResponse>> getOutpass(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        OutpassResponse outpass = outpassService.getOutpassById(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(outpass));
    }
}

