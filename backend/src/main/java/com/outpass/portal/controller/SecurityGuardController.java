package com.outpass.portal.controller;

import com.outpass.portal.dto.response.ApiResponse;
import com.outpass.portal.dto.response.OutpassResponse;
import com.outpass.portal.service.OutpassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/security")
@RequiredArgsConstructor
public class SecurityGuardController {

    private final OutpassService outpassService;

    @GetMapping("/outpass/active")
    public ResponseEntity<ApiResponse<List<OutpassResponse>>> getActiveOutpasses() {
        List<OutpassResponse> active = outpassService.getActiveOutpasses();
        return ResponseEntity.ok(ApiResponse.success(active));
    }

    @GetMapping("/outpass/{id}")
    public ResponseEntity<ApiResponse<OutpassResponse>> getOutpass(@PathVariable Long id) {
        OutpassResponse outpass = outpassService.getOutpassById(id, null);
        return ResponseEntity.ok(ApiResponse.success(outpass));
    }

    @GetMapping("/outpass/today")
    public ResponseEntity<ApiResponse<List<OutpassResponse>>> getTodayOutpasses() {
        List<OutpassResponse> today = outpassService.getTodayOutpasses();
        return ResponseEntity.ok(ApiResponse.success(today));
    }
}

