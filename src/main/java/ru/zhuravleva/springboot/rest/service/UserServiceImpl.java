package ru.zhuravleva.springboot.rest.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.zhuravleva.springboot.rest.dao.UserDao;
import ru.zhuravleva.springboot.rest.model.User;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private UserDao userDao;
    private RoleService roleService;

    @Autowired
    public UserServiceImpl(UserDao userDao, RoleService roleService) {

        this.userDao = userDao;
        this.roleService = roleService;
    }

    @Override
    public List<User> getAllUsers() {
        return userDao.getAllUsers();
    }

    @Override
    public User getUserById(long id) {
        return userDao.getUserById(id);
    }

    @Override
    public void save(User user) {
        user.setPassword(roleService.getCrypt(user.getPassword()));
        userDao.save(user);
    }

    @Override
    public void update(long id, User updatedUser) {
        updatedUser.setPassword(roleService.getCrypt(updatedUser.getPassword()));
        userDao.update(id, updatedUser);
    }

    @Override
    public void delete(long id) {
        userDao.delete(id);
    }

    @Override
    public User getUserByUsername(String username) {
        return userDao.getUserByUsername(username);
    }
}
