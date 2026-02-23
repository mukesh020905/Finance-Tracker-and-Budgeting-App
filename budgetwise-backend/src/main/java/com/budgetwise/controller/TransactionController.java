package com.budgetwise.controller;

import com.budgetwise.model.Transaction;
import com.budgetwise.payload.request.TransactionRequest;
import com.budgetwise.security.services.UserDetailsImpl;
import com.budgetwise.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(transactionService.getAllTransactions(userDetails.getId()));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Transaction>> getTransactionsByDate(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(transactionService.getTransactionsByDate(userDetails.getId(), startDate, endDate));
    }

    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody TransactionRequest key) {
        return ResponseEntity.ok(transactionService.addTransaction(userDetails.getId(), key));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest key) {
        return ResponseEntity.ok(transactionService.updateTransaction(userDetails.getId(), id, key));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {
        transactionService.deleteTransaction(userDetails.getId(), id);
        return ResponseEntity.ok().build();
    }
}
