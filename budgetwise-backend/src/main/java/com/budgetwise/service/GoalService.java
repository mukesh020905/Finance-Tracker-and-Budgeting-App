package com.budgetwise.service;

import com.budgetwise.model.Goal;
import com.budgetwise.model.User;
import com.budgetwise.repository.GoalRepository;
import com.budgetwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {
    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Goal> getUserGoals(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return goalRepository.findByUser(user);
    }

    public Goal addGoal(Long userId, Goal goal) {
        User user = userRepository.findById(userId).orElseThrow();
        goal.setUser(user);
        return goalRepository.save(goal);
    }

    public Goal updateGoal(Long userId, Long goalId, Goal goalDetails) {
        Goal goal = goalRepository.findById(goalId).orElseThrow();
        if (!goal.getUser().getId().equals(userId))
            throw new RuntimeException("Unauthorized");

        goal.setGoalName(goalDetails.getGoalName());
        goal.setTargetAmount(goalDetails.getTargetAmount());
        goal.setCurrentSaved(goalDetails.getCurrentSaved());
        goal.setDeadline(goalDetails.getDeadline());

        return goalRepository.save(goal);
    }

    public void deleteGoal(Long userId, Long goalId) {
        Goal goal = goalRepository.findById(goalId).orElseThrow();
        if (!goal.getUser().getId().equals(userId))
            throw new RuntimeException("Unauthorized");
        goalRepository.delete(goal);
    }
}
