package ru.zhuravleva.springboot.rest.dao;

import org.springframework.stereotype.Repository;
import ru.zhuravleva.springboot.rest.model.Role;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class RoleDaoHiberImpl implements RoleDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Set<Role> getAllRoles() {
        return (Set<Role>) em.createQuery("from Role").getResultStream().collect(Collectors.toSet());
    }

    @Override
    public Role getRoleById(int id) {
        return em.find(Role.class, id);
    }

    @Override
    public void save(Role role) {
        em.persist(role);
    }

    @Override
    public void update(int id, Role updatedRole) {
        em.merge(updatedRole);
    }

    @Override
    public void delete(int id) {
        em.createQuery("delete from Role role where role.id = ?1")
                .setParameter(1, id)
                .executeUpdate();
    }

    @Override
    public Role getRoleByName(String roleName) {
        return (Role) em.createQuery("from Role role where role.name = ?1")
                .setParameter(1, roleName)
                .getSingleResult();
    }




}
