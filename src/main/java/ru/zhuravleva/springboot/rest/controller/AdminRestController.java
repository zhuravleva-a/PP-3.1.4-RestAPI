package ru.zhuravleva.springboot.rest.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.zhuravleva.springboot.rest.exception_handling.NoSuchUserException;
import ru.zhuravleva.springboot.rest.model.Role;
import ru.zhuravleva.springboot.rest.model.User;
import ru.zhuravleva.springboot.rest.service.RoleService;
import ru.zhuravleva.springboot.rest.service.UserService;

import java.util.List;
import java.util.Set;


@RestController
@RequestMapping("/api")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminRestController {

    private UserService userService;
    private RoleService roleService;

    @Autowired
    public AdminRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> showAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> showUserById(@PathVariable("id") int id) {

        User user = userService.getUserById(id);
        if(user == null) {
            throw new NoSuchUserException("User not found");
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/users")
    public ResponseEntity<List<User>> createUser(@RequestBody User user) {

        userService.save(user);
        return new ResponseEntity<>(HttpStatus.OK);

    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@RequestBody User user, @PathVariable("id") int id) {

        userService.update(id, user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity deleteUser(@PathVariable("id") int id) {

        if (userService.getUserById(id) == null) {
            throw new NoSuchUserException("User not found");
        }

        userService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/roles")
    public ResponseEntity<Set<Role>> showAllRoles() {
        Set<Role> roles = roleService.getAllRoles();
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }

    @GetMapping("/roles/{id}")
    public ResponseEntity<Role> showRoleById(@PathVariable("id") int id) {

        return new ResponseEntity<>(roleService.getRoleById(id), HttpStatus.OK);
    }

}

