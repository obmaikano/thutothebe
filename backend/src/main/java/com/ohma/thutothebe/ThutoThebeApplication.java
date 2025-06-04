package com.ohma.thutothebe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.ohma.thutothebe.repository")
@EnableRedisRepositories(basePackages = "com.ohma.thutothebe.redis.repository")
@EnableConfigurationProperties
public class ThutoThebeApplication {
    public static void main(String[] args) {
        SpringApplication.run(ThutoThebeApplication.class, args);
    }
} 