package com.expense.backend.service;

import com.expense.backend.model.Expense;
import com.expense.backend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense createExpense(String userId, String expname, String exppurpose, String expdescription,
                                  Double expquantity, Double expprice, Date expexpenseDate) {
        Expense expense = new Expense(userId, expname, exppurpose, expdescription, expquantity, expprice, expexpenseDate);
        return expenseRepository.save(expense);
    }

    public List<Expense> getExpensesByUserId(String userId) {
        return expenseRepository.findByUserId(userId);
    }

    public Optional<Expense> findByIdAndUserId(String id, String userId) {
        Expense expense = expenseRepository.findByIdAndUserId(id, userId);
        return expense != null ? Optional.of(expense) : Optional.empty();
    }

    public Expense updateExpense(Expense expense, String expname, String exppurpose, String expdescription,
                                  Double expquantity, Double expprice, Date expexpenseDate) {
        if (expname != null && !expname.isEmpty()) {
            expense.setExpname(expname);
        }
        if (exppurpose != null && !exppurpose.isEmpty()) {
            expense.setExppurpose(exppurpose);
        }
        if (expdescription != null && !expdescription.isEmpty()) {
            expense.setExpdescription(expdescription);
        }
        if (expquantity != null) {
            expense.setExpquantity(expquantity);
        }
        if (expprice != null) {
            expense.setExpprice(expprice);
        }
        if (expexpenseDate != null) {
            expense.setExpexpenseDate(expexpenseDate);
        }
        
        // Recalculate total amount
        if (expense.getExpquantity() != null && expense.getExpprice() != null) {
            expense.setExptotalAmount(expense.getExpquantity() * expense.getExpprice());
        }
        
        expense.setUpdatedAt(new Date());
        return expenseRepository.save(expense);
    }

    public void deleteExpense(String id, String userId) {
        expenseRepository.deleteByIdAndUserId(id, userId);
    }
}
