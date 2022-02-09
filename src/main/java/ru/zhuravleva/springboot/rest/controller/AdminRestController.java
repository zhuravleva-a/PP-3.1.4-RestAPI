package ru.zhuravleva.springboot.rest.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.zhuravleva.springboot.rest.exception_handling.NoSuchUserException;
import ru.zhuravleva.springboot.rest.exception_handling.UserIncorrectData;
import ru.zhuravleva.springboot.rest.model.Role;
import ru.zhuravleva.springboot.rest.model.User;
import ru.zhuravleva.springboot.rest.service.RoleService;
import ru.zhuravleva.springboot.rest.service.UserService;


import javax.validation.Valid;
import java.util.HashSet;
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

    @GetMapping("/roles")
    public ResponseEntity<Set<Role>> showAllRoles() {
       Set<Role> roles = roleService.getAllRoles();
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }

//    @GetMapping()
//    public String showAllUsers(ModelMap model, Authentication authentication) {
//        model.addAttribute("users", userService.getAllUsers());
//        model.addAttribute("currentUser", authentication.getPrincipal());
//        model.addAttribute("roles", roleService.getAllRoles());
//        model.addAttribute("newUser", new User());
//        return "admin/index";
//    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> showUserById(@PathVariable("id") int id) {

        User user = userService.getUserById(id);

        if(user == null) {
            throw new NoSuchUserException("User not found");
        }

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

//    @GetMapping("/roles/{id}")
//    public User showUserById(@PathVariable("id") int id) {
//
//        User user = userService.getUserById(id);
//
//        if(user == null) {
//            throw new NoSuchUserException("User not found");
//        }
//
//        return user;
//    }

//    @GetMapping("/{id}")
//    public String showUserById(@PathVariable("id") int id, ModelMap model) {
//        model.addAttribute("user", userService.getUserById(id));
//        return "admin/show";
//    }


//    @GetMapping("/new")
//    public String newUser(ModelMap model) {
//        model.addAttribute("user", new User());
//        model.addAttribute("roles", roleService.getAllRoles());
//        return "new2";
//    }

    @PostMapping("/users")
    public ResponseEntity<List<User>> createUser(@RequestBody User user) {
        //Set<Role> roles = new HashSet<>();
//
//        if(user.getRoles() == null) {
//            user.addRoleToUser(new Role("USER"));
//        } else {
//            for (Role role: user.getRoles()) {
//                roles.add(roleService.getRoleByName(role.getName()));
//                user.setRoles(roles);
//            }
//        }


        userService.save(user);
        System.out.println("adding new user" + user);
        System.out.println(userService.getAllUsers());
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    @PostMapping()
//    public String createUser(@Valid User user, BindingResult bindingResult) {
//        if (bindingResult.hasErrors()) {
//            return "new2";
//        }
//
//        Set<Role> roles = new HashSet<>();
//
//        for (Role role: user.getRoles()) {
//            roles.add(roleService.getRoleByName(role.getName()));
//        }
//        user.setRoles(roles);
//
//        userService.save(user);
//        System.out.println(user);
//        System.out.println(userService.getAllUsers());
//        return "redirect:/admin";
//    }

//    @GetMapping("/{id}/edit")
//    public String editUser(@ModelAttribute("user") User user, ModelMap model, @PathVariable("id") int id) {
//
//        model.addAttribute("roles", roleService.getAllRoles());
//        return "edit2";
//    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@RequestBody User user, @PathVariable("id") int id) {

        userService.update(id, user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    @PostMapping("/{id}")
//    public String updateUser(@ModelAttribute("user") @Valid User user, BindingResult bindingResult,
//                             @PathVariable("id") int id,
//                             @RequestParam(name="roles", required = false) String[] roles) {
//        if (bindingResult.hasErrors()) {
//            return "edit2";
//        }
//
//        Set<Role> roles1 = new HashSet<>();
//
//        if(roles == null) {
//            user.setRoles(userService.getUserById(id).getRoles());
//        } else {
//            for (String role: roles) {
//                roles1.add(roleService.getRoleByName(role));
//                user.setRoles(roles1);
//            }
//        }
//
//        System.out.println("checking edit: " + user);
//
//        userService.update(id, user);
//        return "redirect:/admin";
//    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity deleteUser(@PathVariable("id") int id) {
        if (userService.getUserById(id) == null) {
            throw new NoSuchUserException("User not found");
        }

        userService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    @DeleteMapping("/{id}")
//    public String deleteUser(@PathVariable("id") int id) {
//        userService.delete(id);
//        return "redirect:/admin";
//    }



}

