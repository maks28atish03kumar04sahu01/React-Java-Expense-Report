package com.expense.backend.controller;

import com.expense.backend.dto.CreateExpenseRequest;
import com.expense.backend.model.Expense;
import com.expense.backend.model.User;
import com.expense.backend.service.ExpenseService;
import com.expense.backend.service.UserService;
import com.expense.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/expense/backend/api/v1")
public class CreateExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/{userid}/createexpense")
    public ResponseEntity<?> createExpense(@PathVariable String userid,
                                          @Valid @RequestBody CreateExpenseRequest request,
                                          HttpServletRequest httpRequest) {
        try {
            // Get token from request
            String token = extractToken(httpRequest);
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

            // Create expense
            Expense expense = expenseService.createExpense(
                userid,
                request.getExpname(),
                request.getExppurpose(),
                request.getExpdescription(),
                request.getExpquantity(),
                request.getExpprice(),
                request.getExpexpenseDate()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(expense);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating expense: " + e.getMessage());
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
