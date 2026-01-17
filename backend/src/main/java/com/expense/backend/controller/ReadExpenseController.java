package com.expense.backend.controller;

import com.expense.backend.model.Expense;
import com.expense.backend.model.User;
import com.expense.backend.service.ExpenseService;
import com.expense.backend.service.UserService;
import com.expense.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/expense/backend/api/v1")
public class ReadExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/{userid}/readexpense")
    public ResponseEntity<?> readExpense(@PathVariable String userid, HttpServletRequest request) {
        try {
            // Get token from request
            String token = extractToken(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is required");
            }

            // Validate token and get user info
            String useremail = jwtUtil.extractUsername(token);
            String tokenUserId = jwtUtil.extractUserId(token);

            // Verify userid matches token userId
            if (!userid.equals(tokenUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            // Verify user exists
            Optional<User> userOptional = userService.findById(userid);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            User user = userOptional.get();
            if (!user.getUseremail().equals(useremail)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            // Get expenses
            List<Expense> expenses = expenseService.getExpensesByUserId(userid);

            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error reading expenses: " + e.getMessage());
        }
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
