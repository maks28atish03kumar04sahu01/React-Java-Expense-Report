package com.expense.backend.dto;

public class AuthResponse {
    private String token;
    private String id;
    private String username;
    private String useremail;
    private String userprofileImage;

    // Constructors
    public AuthResponse() {
    }

    public AuthResponse(String token, String id, String username, String useremail, String userprofileImage) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.useremail = useremail;
        this.userprofileImage = userprofileImage;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public String getUserprofileImage() {
        return userprofileImage;
    }

    public void setUserprofileImage(String userprofileImage) {
        this.userprofileImage = userprofileImage;
    }
}
