package com.ht.web.entity;

import org.hibernate.annotations.Index;
import org.springframework.data.jpa.domain.AbstractPersistable;

import javax.persistence.*;

/**
 * Created with IntelliJ IDEA.
 *
 * @author: 薄成文 13-7-5 上午10:13
 * To change this template use File | Settings | File Templates.
 */
@Entity
@Table(name="T_Users")
public class User extends AbstractPersistable<Integer> {

    @Column(nullable=false, unique=true)
    @Index(name="idx_users_username")
    private String username;
    @Column(nullable=false)
    private String password;

    private String name;

    @OneToOne(cascade=CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name="user_ext_info_id")
    private UserExtInfo userExtInfo;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserExtInfo getUserExtInfo() {
        return userExtInfo;
    }

    public void setUserExtInfo(UserExtInfo userExtInfo) {
        this.userExtInfo = userExtInfo;
    }
}
