package com.expense.backend.repository;

import com.expense.backend.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense, String> {
    List<Expense> findByUserId(String userId);
    Expense findByIdAndUserId(String id, String userId);
    void deleteByIdAndUserId(String id, String userId);
}
