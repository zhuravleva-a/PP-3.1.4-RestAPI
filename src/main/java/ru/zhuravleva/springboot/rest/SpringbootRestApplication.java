package ru.zhuravleva.springboot.rest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.thymeleaf.dialect.IDialect;
import org.thymeleaf.extras.springsecurity5.dialect.SpringSecurityDialect;

@SpringBootApplication
public class SpringbootRestApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootRestApplication.class, args);
    }

    @Bean
    IDialect springSecurityDialect() {
        return new SpringSecurityDialect();
    }

}
