package com.budgetwise.service;

import com.budgetwise.model.Category;
import com.budgetwise.model.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    public List<String> getAdvice(Long userId) {
        // 1. Check if API Key is configured
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            return getRuleBasedAdvice(userId);
        }

        try {
            // 2. Build Context
            Map<Category, BigDecimal> spending = analyticsService.getCategoryWiseSpending(userId);
            Profile profile = profileService.getProfile(userId);

            StringBuilder context = new StringBuilder();
            context.append("I am a financial assistant. Analyze this user's data and give 3 short, actionable tips.\n");

            if (profile != null) {
                context.append("Monthly Income: ").append(profile.getMonthlyIncome()).append("\n");
                context.append("Current Savings: ").append(profile.getCurrentSavings()).append("\n");
                context.append("Target Expense: ").append(profile.getTargetExpense()).append("\n");
            }

            context.append("Spending by Category:\n");
            spending.forEach((k, v) -> context.append("- ").append(k).append(": ").append(v).append("\n"));

            // 3. Call Gemini API
            String url = geminiApiUrl + geminiApiKey;

            // Simple JSON structure for Gemini
            Map<String, Object> contentPart = Map.of("text", context.toString());
            Map<String, Object> parts = Map.of("parts", List.of(contentPart));
            Map<String, Object> requestBody = Map.of("contents", List.of(parts));

            Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);

            // 4. Parse Response (Simplified extraction)
            return extractAdviceFromGeminiResponse(response);

        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            return getRuleBasedAdvice(userId); // Fallback
        }
    }

    private List<String> extractAdviceFromGeminiResponse(Map<String, Object> response) {
        List<String> adviceList = new ArrayList<>();
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                String text = (String) parts.get(0).get("text");

                // Split by newlines or bullets to create a list
                String[] lines = text.split("\n");
                for (String line : lines) {
                    String cleanLine = line.replaceAll("^[-*•0-9.]+\\s*", "").trim();
                    if (!cleanLine.isEmpty()) {
                        adviceList.add(cleanLine);
                    }
                }
            }
        } catch (Exception e) {
            adviceList.add("Could not parse AI response. Check your spending habits manually.");
        }
        return adviceList;
    }

    private List<String> getRuleBasedAdvice(Long userId) {
        List<String> advice = new ArrayList<>();
        Map<Category, BigDecimal> spending = analyticsService.getCategoryWiseSpending(userId);
        Profile profile = profileService.getProfile(userId);

        BigDecimal totalExpense = spending.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        // Rule 1: Food > 40%
        if (totalExpense.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal foodExpense = spending.getOrDefault(Category.FOOD, BigDecimal.ZERO);
            if (foodExpense.divide(totalExpense, 2, java.math.RoundingMode.HALF_UP)
                    .compareTo(new BigDecimal("0.40")) > 0) {
                advice.add("Your food spending is high (over 40%). Consider cooking more at home.");
            }
        }

        // Rule 2: Expense > Income (if Profile is set)
        if (profile != null && profile.getMonthlyIncome() != null) {
            if (totalExpense.compareTo(profile.getMonthlyIncome()) > 0) {
                advice.add("Warning: Your expenses exceed your reported monthly income!");
            }
        }

        if (advice.isEmpty()) {
            advice.add("AI Offline: Add an API Key to get personalized insights.");
            advice.add("Tip: Track every expense to see where your money goes.");
        }

        return advice;
    }
}
