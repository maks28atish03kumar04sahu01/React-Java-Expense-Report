package com.expense.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<?> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "Server is running");
        response.put("message", "Expense Report Backend API is up and running!");
        response.put("version", "1.0.0");
        response.put("documentation", "Check API_ENDPOINTS.md for API documentation");
        return ResponseEntity.ok(response);
    }
}
