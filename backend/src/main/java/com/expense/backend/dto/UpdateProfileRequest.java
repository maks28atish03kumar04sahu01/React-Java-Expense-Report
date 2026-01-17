package com.expense.backend.dto;

public class UpdateProfileRequest {
    private String username;
    private String useremail;
    private String userpassword;
    private String userprofileImage;

    // Constructors
    public UpdateProfileRequest() {
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

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

    public String getUserprofileImage() {
        return userprofileImage;
    }

    public void setUserprofileImage(String userprofileImage) {
        this.userprofileImage = userprofileImage;
    }
}
