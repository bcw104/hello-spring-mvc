package com.ht.web.dao;

import com.ht.web.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserDao extends JpaRepository<User, Integer> {

    public User findByUsername(String username);

    public List<User> findByName(String user);

    @Modifying
    @Query("update User u set u.password = ?1 where u.id = ?2")
    public void updateUserPassword(String password, int id);

    @Query("select u from User u where u.id=?1")
    public User findByUserID(int id);
}
