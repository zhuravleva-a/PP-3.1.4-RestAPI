package ru.zhuravleva.springboot.rest.dao;


import ru.zhuravleva.springboot.rest.model.Role;
import ru.zhuravleva.springboot.rest.model.User;

import java.util.List;

public interface UserDao {
    List<User> getAllUsers();
    User getUserById(long id);
    void save(User user);
    void update(long id, User updatedUser);
    void delete(long id);

    User getUserByUsername(String username);

    void addRoleToUser(User user, Role role);

}
