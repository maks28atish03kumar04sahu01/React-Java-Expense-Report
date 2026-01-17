package com.expense.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.Date;

public class CreateExpenseRequest {
    
    @NotBlank(message = "Expense name is required")
    private String expname;
    
    @NotBlank(message = "Expense purpose is required")
    private String exppurpose;
    
    @NotBlank(message = "Expense description is required")
    private String expdescription;
    
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Double expquantity;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double expprice;
    
    @NotNull(message = "Expense date is required")
    private Date expexpenseDate;

    // Constructors
    public CreateExpenseRequest() {
    }

    // Getters and Setters
    public String getExpname() {
        return expname;
    }

    public void setExpname(String expname) {
        this.expname = expname;
    }

    public String getExppurpose() {
        return exppurpose;
    }

    public void setExppurpose(String exppurpose) {
        this.exppurpose = exppurpose;
    }

    public String getExpdescription() {
        return expdescription;
    }

    public void setExpdescription(String expdescription) {
        this.expdescription = expdescription;
    }

    public Double getExpquantity() {
        return expquantity;
    }

    public void setExpquantity(Double expquantity) {
        this.expquantity = expquantity;
    }

    public Double getExpprice() {
        return expprice;
    }

    public void setExpprice(Double expprice) {
        this.expprice = expprice;
    }

    public Date getExpexpenseDate() {
        return expexpenseDate;
    }

    public void setExpexpenseDate(Date expexpenseDate) {
        this.expexpenseDate = expexpenseDate;
    }
}
