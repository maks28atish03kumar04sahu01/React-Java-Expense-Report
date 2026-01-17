package com.expense.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.Date;

@Document(collection = "user")
public class User {
    
    @Id
    private String id;
    
    private String username;
    
    @Indexed(unique = true)
    private String useremail;
    
    private String userpassword;
    
    private String userprofileImage;
    
    private Date usercreatedAt;
    
    private Date userupdatedAt;

    // Constructors
    public User() {
    }

    public User(String username, String useremail, String userpassword) {
        this.username = username;
        this.useremail = useremail;
        this.userpassword = userpassword;
        this.usercreatedAt = new Date();
        this.userupdatedAt = new Date();
    }

    // Getters and Setters
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

    public Date getUsercreatedAt() {
        return usercreatedAt;
    }

    public void setUsercreatedAt(Date usercreatedAt) {
        this.usercreatedAt = usercreatedAt;
    }

    public Date getUserupdatedAt() {
        return userupdatedAt;
    }

    public void setUserupdatedAt(Date userupdatedAt) {
        this.userupdatedAt = userupdatedAt;
    }
}
