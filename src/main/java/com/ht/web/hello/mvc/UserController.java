package com.ht.web.hello.mvc;

import com.ht.web.dao.UserDao;
import com.ht.web.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 *
 * @author: 薄成文 13-7-2 下午3:38
 * To change this template use File | Settings | File Templates.
 */
@RequestMapping("/user")
@Controller
public class UserController {
    public static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = {"", "list"})
    private String listUsers(Model model) {
        log.debug("显示用户列表");
        List<User> userList = userDao.findAll();
        if (userList.isEmpty()) {
            User user = new User();
            user.setUsername("zhangsan");
            user.setPassword("123456");
            user.setName("张三");
            userDao.save(user);
        }
        model.addAttribute("users", userDao.findAll());
        return "users";
    }

    @RequestMapping("/{username}")
    private String userInfo(@PathVariable String username, Model model){
        log.debug("用户名:{}", username);
        model.addAttribute("user", userDao.findByUsername(username));
        return "userInfo";
    }

}
