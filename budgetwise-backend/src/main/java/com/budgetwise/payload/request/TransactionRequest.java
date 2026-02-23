package com.budgetwise.payload.request;

import com.budgetwise.model.Category;
import com.budgetwise.model.TransactionType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionRequest {
    @NotNull
    private TransactionType type;

    @NotNull
    private BigDecimal amount;

    @NotNull
    private Category category;

    @NotNull
    private LocalDate date;

    private String description;
}
