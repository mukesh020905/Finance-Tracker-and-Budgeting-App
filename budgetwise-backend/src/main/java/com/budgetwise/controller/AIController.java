package com.budgetwise.controller;

import com.budgetwise.security.services.UserDetailsImpl;
import com.budgetwise.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @GetMapping("/advice")
    public ResponseEntity<List<String>> getAdvice(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(aiService.getAdvice(userDetails.getId()));
    }
}
