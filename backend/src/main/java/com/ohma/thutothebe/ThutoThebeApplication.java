package com.ohma.thutothebe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.ohma.thutothebe.repository")
@EnableConfigurationProperties
public class ThutoThebeApplication {
    public static void main(String[] args) {
        SpringApplication.run(ThutoThebeApplication.class, args);
    }
} 