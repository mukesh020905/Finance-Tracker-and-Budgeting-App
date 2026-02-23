package com.budgetwise.payload.request;

import com.budgetwise.model.Category;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetRequest {

    @NotNull
    private Category category;

    @NotNull
    @Positive
    private BigDecimal limit;
}
