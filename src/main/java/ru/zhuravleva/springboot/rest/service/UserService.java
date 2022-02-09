package ru.zhuravleva.springboot.rest.service;


import ru.zhuravleva.springboot.rest.model.Role;
import ru.zhuravleva.springboot.rest.model.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(long id);
    void save(User user);
    void update(long id, User updatedUser);
    void delete(long id);

    void addRoleToUser(User user, Role role);

    User getUserByUsername(String username);
}