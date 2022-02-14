package ru.zhuravleva.springboot.rest.dao;

import org.springframework.stereotype.Repository;
import ru.zhuravleva.springboot.rest.model.Role;
import ru.zhuravleva.springboot.rest.model.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class UserDaoHiberImpl implements UserDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    @SuppressWarnings("unchecked")
    public List<User> getAllUsers() {
        return em.createQuery("from User").getResultList();
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

        return (User) em.createQuery("from User user where user.email = ?1")
                .setParameter(1, username)
                .getSingleResult();
    }

}