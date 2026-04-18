package com.smartcampus.unisync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
	"com.smartcampus.resource",
	"com.smartcampus.common",
	"com.smartcampus.config"
})
@EntityScan(basePackages = "com.smartcampus.resource.entity")
@EnableJpaRepositories(basePackages = "com.smartcampus.resource.repository")
public class UnisyncApplication {

	public static void main(String[] args) {
		SpringApplication.run(UnisyncApplication.class, args);
	}

}
