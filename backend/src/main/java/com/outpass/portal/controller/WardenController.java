package com.outpass.portal.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.outpass.portal.dto.response.ApiResponse;
import com.outpass.portal.dto.response.OutpassResponse;
import com.outpass.portal.model.entity.Warden;
import com.outpass.portal.repository.WardenRepository;
import com.outpass.portal.security.UserPrincipal;
import com.outpass.portal.service.OutpassService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/warden")
@RequiredArgsConstructor
public class WardenController {

    private final OutpassService outpassService;
    private final WardenRepository wardenRepository;

    @GetMapping("/outpass/pending")
    public ResponseEntity<ApiResponse<List<OutpassResponse>>> getPendingOutpasses(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Warden warden = wardenRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Warden not found"));
        
        List<OutpassResponse> pending = outpassService.getPendingOutpassesByHostel(warden.getHostel());
        return ResponseEntity.ok(ApiResponse.success(pending));
    }

    @PutMapping("/outpass/{id}/approve")
    public ResponseEntity<ApiResponse<OutpassResponse>> approveOutpass(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Warden warden = wardenRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Warden not found"));
        
        OutpassResponse approved = outpassService.approveOutpass(id, warden.getHostel());
        return ResponseEntity.ok(ApiResponse.success("Outpass approved successfully", approved));
    }

    @PutMapping("/outpass/{id}/decline")
    public ResponseEntity<ApiResponse<OutpassResponse>> declineOutpass(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Warden warden = wardenRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Warden not found"));
        
        OutpassResponse declined = outpassService.declineOutpass(id, warden.getHostel());
        return ResponseEntity.ok(ApiResponse.success("Outpass declined successfully", declined));
    }

    @GetMapping("/outpass/history")
    public ResponseEntity<ApiResponse<List<OutpassResponse>>> getOutpassHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Warden warden = wardenRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Warden not found"));
        
        List<OutpassResponse> history = outpassService.getAllOutpassesByHostel(warden.getHostel());
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}

