package com.expense.backend.dto;

public class ProfileResponse {
    private String userid;
    private String username;
    private String useremail;
    private String userprofileImage;

    // Constructors
    public ProfileResponse() {
    }

    public ProfileResponse(String userid, String username, String useremail, String userprofileImage) {
        this.userid = userid;
        this.username = username;
        this.useremail = useremail;
        this.userprofileImage = userprofileImage;
    }

    // Getters and Setters
    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
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
