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
 * User: 聂玉宽
 * Date: 13-7-3
 * Time: 上午10:50
 * To change this template use File | Settings | File Templates.
 */


@Controller
public class NewController {
    public static final Logger log = LoggerFactory.getLogger(NewController.class);
@RequestMapping("/")
    public String hello(){
         return "redirect:/well.html";
    }
@RequestMapping("kaka")
    public String well(){
    return "well";
}
@RequestMapping("json")
@ResponseBody
    public Map<String,Object> well1(){

        Map<String,Object> map = new HashMap<>();
        map.put("a",111);
        map.put("b",222);
        map.put("c",333);
        return map;
}
@RequestMapping("form")
    public String well2(String name,String email){
    System.out.println(name+"=======================");
    System.out.println(email+"=====================");

    return "well1";

}
@RequestMapping("wel")
    public String well3(Model model){
        model.addAttribute("wel","hello");
        System.out.println("=============================");
        return "wel";

}





}
