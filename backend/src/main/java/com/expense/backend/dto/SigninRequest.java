package com.expense.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class SigninRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String useremail;
    
    @NotBlank(message = "Password is required")
    private String userpassword;

    // Constructors
    public SigninRequest() {
    }

    // Getters and Setters
    public String getUseremail() {
        return useremail;
    }

    public void setUseremail(String useremail) {
        this.useremail = useremail;
    }

    public String getUserpassword() {
        return userpassword;
    }

    public void setUserpassword(String userpassword) {
        this.userpassword = userpassword;
    }
}
