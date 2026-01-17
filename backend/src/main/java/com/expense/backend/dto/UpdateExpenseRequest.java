package com.expense.backend.dto;

import java.util.Date;

public class UpdateExpenseRequest {
    private String expname;
    private String exppurpose;
    private String expdescription;
    private Double expquantity;
    private Double expprice;
    private Date expexpenseDate;

    // Constructors
    public UpdateExpenseRequest() {
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
