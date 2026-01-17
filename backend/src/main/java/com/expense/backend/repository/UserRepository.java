package com.expense.backend.repository;

import com.expense.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUseremail(String useremail);
    boolean existsByUseremail(String useremail);
}
