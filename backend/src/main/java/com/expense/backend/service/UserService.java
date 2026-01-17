package com.expense.backend.service;

import com.expense.backend.model.User;
import com.expense.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(String username, String useremail, String userpassword, String userprofileImage) {
        User user = new User();
        user.setUsername(username);
        user.setUseremail(useremail);
        user.setUserpassword(passwordEncoder.encode(userpassword));
        if (userprofileImage != null && !userprofileImage.isEmpty()) {
            user.setUserprofileImage(userprofileImage);
        }
        user.setUsercreatedAt(new Date());
        user.setUserupdatedAt(new Date());
        return userRepository.save(user);
    }

    public Optional<User> findByUseremail(String useremail) {
        return userRepository.findByUseremail(useremail);
    }

    public boolean existsByUseremail(String useremail) {
        return userRepository.existsByUseremail(useremail);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public User updateUser(User user, String username, String useremail, String userpassword, String userprofileImage) {
        if (username != null && !username.isEmpty()) {
            user.setUsername(username);
        }
        if (useremail != null && !useremail.isEmpty()) {
            user.setUseremail(useremail);
        }
        if (userpassword != null && !userpassword.isEmpty()) {
            user.setUserpassword(passwordEncoder.encode(userpassword));
        }
        if (userprofileImage != null) {
            user.setUserprofileImage(userprofileImage);
        }
        user.setUserupdatedAt(new Date());
        return userRepository.save(user);
    }
}
