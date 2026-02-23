package com.budgetwise.controller;

import com.budgetwise.model.Category;
import com.budgetwise.security.services.UserDetailsImpl;
import com.budgetwise.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/category")
    public ResponseEntity<Map<Category, BigDecimal>> getCategorySpending(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(analyticsService.getCategoryWiseSpending(userDetails.getId()));
    }

    @GetMapping("/monthly")
    public ResponseEntity<Map<String, Map<String, BigDecimal>>> getMonthlyAnalytics(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(analyticsService.getMonthlyIncomeVsExpense(userDetails.getId()));
    }
}
