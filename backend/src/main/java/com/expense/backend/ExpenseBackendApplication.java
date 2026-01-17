package com.expense.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ExpenseBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExpenseBackendApplication.class, args);
    }
}
