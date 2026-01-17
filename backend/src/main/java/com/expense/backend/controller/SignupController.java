package com.expense.backend.controller;

import com.expense.backend.dto.AuthResponse;
import com.expense.backend.dto.SignupRequest;
import com.expense.backend.model.User;
import com.expense.backend.service.UserService;
import com.expense.backend.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/expense/backend/api/v1")
public class SignupController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            // Check if user already exists
            if (userService.existsByUseremail(request.getUseremail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User with this email already exists");
            }

            // Create user
            User user = userService.createUser(
                request.getUsername(),
                request.getUseremail(),
                request.getUserpassword(),
                request.getUserprofileImage()
            );

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getUseremail());

            // Create response
            AuthResponse response = new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getUseremail(),
                user.getUserprofileImage()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error during signup: " + e.getMessage());
        }
    }
}
