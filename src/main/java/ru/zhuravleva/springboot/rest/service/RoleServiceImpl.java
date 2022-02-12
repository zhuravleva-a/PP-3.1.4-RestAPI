package ru.zhuravleva.springboot.rest.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.zhuravleva.springboot.rest.dao.RoleDao;
import ru.zhuravleva.springboot.rest.model.Role;

import javax.transaction.Transactional;
import java.util.Set;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {

    private RoleDao roleDao;
    private final BCryptPasswordEncoder bCrypt;

    public RoleServiceImpl(RoleDao roleDao, BCryptPasswordEncoder bCrypt) {

        this.roleDao = roleDao;
        this.bCrypt = bCrypt;
    }

    @Override
    public String getCrypt(String password) {
        return bCrypt.encode(password);
    }

    @Override
    public Set<Role> getAllRoles() {
        return roleDao.getAllRoles();
    }

    @Override
    public Role getRoleById(int id) {
        return roleDao.getRoleById(id);
    }

    @Override
    public void save(Role role) {
        roleDao.save(role);
    }

    @Override
    public void update(int id, Role updatedRole) {

        roleDao.update(id, updatedRole);
    }

    @Override
    public void delete(int id) {
        roleDao.delete(id);

    }

    @Override
    public Role getRoleByName(String roleName) {
        return roleDao.getRoleByName(roleName);
    }


}
