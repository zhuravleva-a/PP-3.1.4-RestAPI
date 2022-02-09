package ru.zhuravleva.springboot.rest.exception_handling;

public class UserIncorrectData {
    private String info;

    public UserIncorrectData() {

    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }
}
