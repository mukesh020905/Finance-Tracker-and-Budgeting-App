package com.budgetwise.service;

import com.budgetwise.model.Category;
import com.budgetwise.model.Profile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class AIServiceTest {

    @Mock
    private AnalyticsService analyticsService;

    @Mock
    private ProfileService profileService;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private AIService aiService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(aiService, "geminiApiKey", "test-api-key");
        ReflectionTestUtils.setField(aiService, "geminiApiUrl", "http://fake-api-url/");
    }

    @Test
    void getAdvice_Fallback_WhenExceptionOccurs() {
        // Arrange
        Long userId = 1L;
        Map<Category, BigDecimal> spending = new HashMap<>();
        spending.put(Category.FOOD, new BigDecimal("500.00"));

        when(analyticsService.getCategoryWiseSpending(userId)).thenReturn(spending);
        when(profileService.getProfile(userId)).thenReturn(new Profile());
        when(restTemplate.postForObject(anyString(), any(), any())).thenThrow(new RuntimeException("API Error"));

        // Act
        List<String> advice = aiService.getAdvice(userId);

        // Assert
        assertNotNull(advice);
        assertFalse(advice.isEmpty());
        // Should contain fallback advice or default advice
        assertTrue(
                advice.stream().anyMatch(s -> s.contains("AI Offline") || s.contains("Food") || s.contains("Track")));
    }

    @Test
    void getAdvice_RuleBased_HighFoodSpending() {
        // Arrange
        Long userId = 1L;
        ReflectionTestUtils.setField(aiService, "geminiApiKey", null); // Simulate no API key

        Map<Category, BigDecimal> spending = new HashMap<>();
        spending.put(Category.FOOD, new BigDecimal("600.00")); // High food spending
        spending.put(Category.TRANSPORT, new BigDecimal("100.00"));

        // Total = 700. Food = 600. 600/700 = 0.85 > 0.40

        when(analyticsService.getCategoryWiseSpending(userId)).thenReturn(spending);
        when(profileService.getProfile(userId)).thenReturn(new Profile());

        // Act
        List<String> advice = aiService.getAdvice(userId);

        // Assert
        assertNotNull(advice);
        assertTrue(advice.stream().anyMatch(s -> s.contains("food spending is high")));
    }
}
