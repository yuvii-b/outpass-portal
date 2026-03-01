package com.outpass.portal.controller;

import com.outpass.portal.dto.response.ApiResponse;
import com.outpass.portal.dto.response.OutpassResponse;
import com.outpass.portal.security.UserPrincipal;
import com.outpass.portal.service.OutpassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/warden")
@RequiredArgsConstructor
public class WardenController {

    private final OutpassService outpassService;

    @GetMapping("/outpass/pending")
    public ResponseEntity<ApiResponse<List<OutpassResponse>>> getPendingOutpasses() {
        List<OutpassResponse> pending = outpassService.getPendingOutpasses();
        return ResponseEntity.ok(ApiResponse.success(pending));
    }

    @PutMapping("/outpass/{id}/approve")
    public ResponseEntity<ApiResponse<OutpassResponse>> approveOutpass(@PathVariable Long id) {
        OutpassResponse approved = outpassService.approveOutpass(id);
        return ResponseEntity.ok(ApiResponse.success("Outpass approved successfully", approved));
    }

    @PutMapping("/outpass/{id}/decline")
    public ResponseEntity<ApiResponse<OutpassResponse>> declineOutpass(@PathVariable Long id) {
        OutpassResponse declined = outpassService.declineOutpass(id);
        return ResponseEntity.ok(ApiResponse.success("Outpass declined successfully", declined));
    }

    @GetMapping("/outpass/history")
    public ResponseEntity<ApiResponse<List<OutpassResponse>>> getOutpassHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<OutpassResponse> history = outpassService.getStudentOutpasses(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}

