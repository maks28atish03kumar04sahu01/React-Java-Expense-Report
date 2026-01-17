package com.expense.backend.service;

import com.expense.backend.model.BlacklistedToken;
import com.expense.backend.repository.BlacklistedTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class TokenBlacklistService {

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    public void blacklistToken(String token, String userId, Date expirationDate) {
        // Check if token is already blacklisted
        if (!blacklistedTokenRepository.existsByToken(token)) {
            BlacklistedToken blacklistedToken = new BlacklistedToken(token, userId, expirationDate);
            blacklistedTokenRepository.save(blacklistedToken);
        }
    }

    public boolean isTokenBlacklisted(String token) {
        Optional<BlacklistedToken> blacklistedToken = blacklistedTokenRepository.findByToken(token);
        if (blacklistedToken.isPresent()) {
            // Token is blacklisted
            return true;
        }
        return false;
    }

    // Clean up expired tokens periodically (runs every hour)
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void cleanupExpiredTokens() {
        Date now = new Date();
        blacklistedTokenRepository.findAll().forEach(token -> {
            if (token.getExpirationDate().before(now)) {
                blacklistedTokenRepository.delete(token);
            }
        });
    }
}
