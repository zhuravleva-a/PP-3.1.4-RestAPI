package ru.zhuravleva.springboot.rest.dao;

import org.springframework.stereotype.Repository;
import ru.zhuravleva.springboot.rest.model.Role;
import ru.zhuravleva.springboot.rest.model.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Set;

@Repository
public class UserDaoHiberImpl implements UserDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<User> getAllUsers() {
        return em.createQuery("from User", User.class).getResultList();
    }

    @Override
    public User getUserById(long id) {
        return em.find(User.class, id);
    }

    @Override
    public void save(User user) {
        em.persist(user);
    }

    @Override
    public void update(long id, User updatedUser) {
        em.merge(updatedUser);
    }

    @Override
    public void delete(long id) {
        em.createQuery("delete from User user where user.id = ?1")
                .setParameter(1, id)
                .executeUpdate();
    }

    @Override
    public User getUserByUsername(String username) {

        return (User) em.createQuery("from User user inner join fetch user.roles where user.email = ?1")
                .setParameter(1, username)
                .getSingleResult();
    }

}