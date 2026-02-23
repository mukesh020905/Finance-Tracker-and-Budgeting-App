package com.budgetwise.controller;

import com.budgetwise.model.Budget;
import com.budgetwise.payload.request.BudgetRequest;
import com.budgetwise.security.services.UserDetailsImpl;
import com.budgetwise.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<Budget>> getUserBudgets(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(budgetService.getUserBudgets(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<Budget> setBudget(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody BudgetRequest budgetRequest) {
        return ResponseEntity.ok(
                budgetService.setBudget(userDetails.getId(), budgetRequest.getCategory(), budgetRequest.getLimit()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id) {
        budgetService.deleteBudget(userDetails.getId(), id);
        return ResponseEntity.ok().build();
    }
}
