package ru.zhuravleva.springboot.rest.service;


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
//    private final BCryptPasswordEncoder bCryptPasswordEncoder;
//
//    public RoleServiceImpl(BCryptPasswordEncoder bCryptPasswordEncoder, RoleDao roleDao) {
//        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
//        this.roleDao = roleDao;
//    }

    public RoleServiceImpl(RoleDao roleDao) {
        this.roleDao = roleDao;
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
