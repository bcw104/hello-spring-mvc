package com.ht.web.hello.mvc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 *
 * @author: 薄成文 13-7-2 下午3:38
 * To change this template use File | Settings | File Templates.
 */
@RequestMapping("/")
@Controller
public class HomeController {
    public static final Logger log = LoggerFactory.getLogger(HomeController.class);
    private String hello() {
        return "redirect:/index.html";
    }

    @RequestMapping("form")
    private String hello2(String username, String password) {
        System.out.println(username);
        System.out.println(password);
        return "redirect:/index2.html";
    }

    @RequestMapping("hello")
    public String test(Model model) {
        String s = "hello";
        model.addAttribute("var", s);
        System.out.println("hello");
        return "hello";
    }

    @RequestMapping("json")
    @ResponseBody
    public Map<String, Object> getJson() {
        Map<String, Object> map = new HashMap<>();
        map.put("a", "1");
        map.put("b", 2);
        map.put("c", 4.0F);
        return map;
    }
}