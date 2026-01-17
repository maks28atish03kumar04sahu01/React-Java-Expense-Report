package com.expense.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Date;

@Document(collection = "expense")
public class Expense {
    
    @Id
    private String id;
    
    private String userId;
    
    private String expname;
    
    private String exppurpose;
    
    private String expdescription;
    
    private Double expquantity;
    
    private Double expprice;
    
    private Double exptotalAmount;
    
    private Date expexpenseDate;
    
    private Date createdAt;
    
    private Date updatedAt;

    // Constructors
    public Expense() {
    }

    public Expense(String userId, String expname, String exppurpose, String expdescription, 
                   Double expquantity, Double expprice, Date expexpenseDate) {
        this.userId = userId;
        this.expname = expname;
        this.exppurpose = exppurpose;
        this.expdescription = expdescription;
        this.expquantity = expquantity;
        this.expprice = expprice;
        this.exptotalAmount = expquantity * expprice;
        this.expexpenseDate = expexpenseDate;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

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

    public Double getExptotalAmount() {
        return exptotalAmount;
    }

    public void setExptotalAmount(Double exptotalAmount) {
        this.exptotalAmount = exptotalAmount;
    }

    public Date getExpexpenseDate() {
        return expexpenseDate;
    }

    public void setExpexpenseDate(Date expexpenseDate) {
        this.expexpenseDate = expexpenseDate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
