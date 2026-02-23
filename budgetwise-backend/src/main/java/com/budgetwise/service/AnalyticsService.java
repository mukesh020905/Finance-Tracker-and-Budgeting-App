package com.budgetwise.service;

import com.budgetwise.model.Category;
import com.budgetwise.model.Transaction;
import com.budgetwise.model.TransactionType;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<Category, BigDecimal> getCategoryWiseSpending(Long userId) {
        List<Transaction> transactions = transactionRepository
                .findByUser(userRepository.findById(userId).orElseThrow());

        return transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)));
    }

    public Map<String, Map<String, BigDecimal>> getMonthlyIncomeVsExpense(Long userId) {
        List<Transaction> transactions = transactionRepository
                .findByUser(userRepository.findById(userId).orElseThrow());

        Map<String, Map<String, BigDecimal>> result = new HashMap<>();

        transactions.forEach(t -> {
            String month = t.getDate().getMonth().toString();
            result.putIfAbsent(month, new HashMap<>());
            Map<String, BigDecimal> monthData = result.get(month);

            String type = t.getType().toString(); // INCOME or EXPENSE
            monthData.put(type, monthData.getOrDefault(type, BigDecimal.ZERO).add(t.getAmount()));
        });

        return result;
    }
}
