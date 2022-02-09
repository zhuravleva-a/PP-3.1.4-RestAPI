package ru.zhuravleva.springboot.rest.exception_handling;

public class NoSuchUserException extends RuntimeException {
    public NoSuchUserException(String message) {
        super(message);
    }
}
