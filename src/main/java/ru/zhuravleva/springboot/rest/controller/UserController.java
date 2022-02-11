package ru.zhuravleva.springboot.rest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import ru.zhuravleva.springboot.rest.service.UserService;


@Controller
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping()
    public String getCurrentUser(Authentication authentication, ModelMap model) {
        model.addAttribute("currentUser", authentication.getPrincipal());
        model.addAttribute("currentUserRoles", authentication.getAuthorities());
        return "index";
    }

}

