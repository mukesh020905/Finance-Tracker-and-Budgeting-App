package com.budgetwise.service;

import com.budgetwise.model.Budget;
import com.budgetwise.model.Category;
import com.budgetwise.model.User;
import com.budgetwise.repository.BudgetRepository;
import com.budgetwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Budget> getUserBudgets(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return budgetRepository.findByUser(user);
    }

    public Budget setBudget(Long userId, Category category, BigDecimal limit) {
        User user = userRepository.findById(userId).orElseThrow();
        Optional<Budget> existingBudget = budgetRepository.findByUserAndCategory(user, category);

        Budget budget;
        if (existingBudget.isPresent()) {
            budget = existingBudget.get();
            budget.setMonthlyLimit(limit);
        } else {
            budget = new Budget();
            budget.setUser(user);
            budget.setCategory(category);
            budget.setMonthlyLimit(limit);
        }
        return budgetRepository.save(budget);
    }

    public void deleteBudget(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId).orElseThrow();
        if (!budget.getUser().getId().equals(userId))
            throw new RuntimeException("Unauthorized");
        budgetRepository.delete(budget);
    }
}
