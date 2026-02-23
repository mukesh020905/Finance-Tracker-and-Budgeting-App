package com.budgetwise.controller;

import com.budgetwise.model.Goal;
import com.budgetwise.security.services.UserDetailsImpl;
import com.budgetwise.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @GetMapping
    public ResponseEntity<List<Goal>> getUserGoals(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(goalService.getUserGoals(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<Goal> addGoal(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Goal goal) {
        return ResponseEntity.ok(goalService.addGoal(userDetails.getId(), goal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id,
            @RequestBody Goal goal) {
        return ResponseEntity.ok(goalService.updateGoal(userDetails.getId(), id, goal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {
        goalService.deleteGoal(userDetails.getId(), id);
        return ResponseEntity.ok().build();
    }
}
