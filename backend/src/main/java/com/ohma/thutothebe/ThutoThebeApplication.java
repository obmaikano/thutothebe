package com.ohma.thutothebe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ThutoThebeApplication {
    public static void main(String[] args) {
        SpringApplication.run(ThutoThebeApplication.class, args);
    }
} 