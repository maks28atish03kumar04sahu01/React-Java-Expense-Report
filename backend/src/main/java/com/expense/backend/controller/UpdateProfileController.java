package com.expense.backend.controller;

import com.expense.backend.dto.ProfileResponse;
import com.expense.backend.dto.UpdateProfileRequest;
import com.expense.backend.model.User;
import com.expense.backend.service.UserService;
import com.expense.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/expense/backend/api/v1")
public class UpdateProfileController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/{userid}/getprofile")
    public ResponseEntity<?> getProfile(@PathVariable String userid, HttpServletRequest request) {
        try {
            // Get token from request
            String token = extractToken(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is required");
            }

            // Validate token and get user email
            String useremail = jwtUtil.extractUsername(token);
            String tokenUserId = jwtUtil.extractUserId(token);

            // Verify userid matches token userId
            if (!userid.equals(tokenUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            // Find user
            Optional<User> userOptional = userService.findById(userid);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            User user = userOptional.get();

            // Verify useremail matches
            if (!user.getUseremail().equals(useremail)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            // Create response
            ProfileResponse response = new ProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getUseremail(),
                user.getUserprofileImage()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error getting profile: " + e.getMessage());
        }
    }

    @PatchMapping("/{userid}/updateprofile")
    public ResponseEntity<?> updateProfile(@PathVariable String userid,
                                          @RequestBody UpdateProfileRequest request,
                                          HttpServletRequest httpRequest) {
        try {
            // Get token from request
            String token = extractToken(httpRequest);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is required");
            }

            // Validate token and get user email
            String useremail = jwtUtil.extractUsername(token);
            String tokenUserId = jwtUtil.extractUserId(token);

            // Verify userid matches token userId
            if (!userid.equals(tokenUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            // Find user
            Optional<User> userOptional = userService.findById(userid);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            User user = userOptional.get();

            // Verify useremail matches
            if (!user.getUseremail().equals(useremail)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            // Update user
            User updatedUser = userService.updateUser(
                user,
                request.getUsername(),
                request.getUseremail(),
                request.getUserpassword(),
                request.getUserprofileImage()
            );

            // Create response
            ProfileResponse response = new ProfileResponse(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getUseremail(),
                updatedUser.getUserprofileImage()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating profile: " + e.getMessage());
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
