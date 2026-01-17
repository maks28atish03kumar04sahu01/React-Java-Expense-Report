package com.expense.backend.controller;

import com.expense.backend.dto.AuthResponse;
import com.expense.backend.dto.SigninRequest;
import com.expense.backend.model.User;
import com.expense.backend.service.UserService;
import com.expense.backend.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/expense/backend/api/v1")
public class SigninController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@Valid @RequestBody SigninRequest request) {
        try {
            // Find user by email
            Optional<User> userOptional = userService.findByUseremail(request.getUseremail());
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
            }

            User user = userOptional.get();

            // Verify password
            if (!passwordEncoder.matches(request.getUserpassword(), user.getUserpassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
            }

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

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error during signin: " + e.getMessage());
        }
    }
}
