package ru.zhuravleva.springboot.rest.util;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.zhuravleva.springboot.rest.model.Role;
import ru.zhuravleva.springboot.rest.service.UserService;
import ru.zhuravleva.springboot.rest.model.User;
import ru.zhuravleva.springboot.rest.service.RoleService;

import javax.annotation.PostConstruct;

@Component
public class DBInit {

    private UserService userService;
    private RoleService roleService;

    @Autowired
    public DBInit(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    public void createUsersWithRoles() {

        Role role1 = new Role("ADMIN");
        Role role2 = new Role("USER");

        roleService.save(role1);
        roleService.save(role2);

        User user1 = new User("admin", "admin", 35, "admin@email.com");
        User user2 = new User("user", "user", 28, "user@email.com");
        User user3 = new User("admin&user", "admin&user", 37, "admin_user@email.com");

        // password = pass

        user1.addRoleToUser(role1);
        user2.addRoleToUser(role2);
        user3.addRoleToUser(role1);
        user3.addRoleToUser(role2);

        userService.save(user1);
        userService.save(user2);
        userService.save(user3);

    }

}