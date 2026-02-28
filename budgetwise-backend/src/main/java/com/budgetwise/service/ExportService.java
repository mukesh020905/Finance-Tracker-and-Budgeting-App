package com.budgetwise.service;

import com.budgetwise.model.Transaction;
import com.budgetwise.repository.TransactionRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExportService {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private GoalService goalService;

    public ByteArrayInputStream transactionsToPdf(Long userId) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font font = FontFactory.getFont(FontFactory.COURIER, 14, BaseColor.BLACK);
            Paragraph para = new Paragraph("BudgetWise - Transaction Report", font);
            para.setAlignment(Element.ALIGN_CENTER);
            document.add(para);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(4);
            // Add PDF Table Header ->
            java.util.stream.Stream.of("Date", "Category", "Type", "Amount")
                    .forEach(headerTitle -> {
                        PdfPCell header = new PdfPCell();
                        header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                        header.setBorderWidth(2);
                        header.setPhrase(new Phrase(headerTitle));
                        table.addCell(header);
                    });

            List<Transaction> transactions = transactionService.getAllTransactions(userId);

            for (Transaction transaction : transactions) {
                table.addCell(transaction.getDate().toString());
                table.addCell(transaction.getCategory().toString());
                table.addCell(transaction.getType().toString());
                table.addCell(transaction.getAmount().toString());
            }

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream transactionsToCsv(Long userId) {
        List<Transaction> transactions = transactionService.getAllTransactions(userId);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter pw = new PrintWriter(out, true, StandardCharsets.UTF_8);

        pw.println("Date,Category,Type,Amount,Description");
        for (Transaction t : transactions) {
            String description = t.getDescription() != null ? t.getDescription().replace(",", " ") : "";
            pw.printf("%s,%s,%s,%s,%s%n",
                    t.getDate(),
                    t.getCategory(),
                    t.getType(),
                    t.getAmount(),
                    description);
        }
        pw.flush();
        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream exportBackupData(Long userId) {
        Map<String, Object> backupData = new HashMap<>();
        backupData.put("transactions", transactionService.getAllTransactions(userId));
        backupData.put("budgets", budgetService.getUserBudgets(userId));
        backupData.put("goals", goalService.getUserGoals(userId));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.writeValue(out, backupData);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ByteArrayInputStream(out.toByteArray());
    }
}
