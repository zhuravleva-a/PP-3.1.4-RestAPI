package ru.zhuravleva.springboot.rest.dao;


import ru.zhuravleva.springboot.rest.model.Role;

import java.util.Set;

public interface RoleDao {
    Set<Role> getAllRoles();
    Role getRoleById(int id);
    void save(Role role);
    void update(int id, Role updatedRole);
    void delete(int id);
    Role getRoleByName(String roleName);


}

