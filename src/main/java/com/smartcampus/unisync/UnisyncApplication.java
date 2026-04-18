package com.smartcampus.unisync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.smartcampus")
public class UnisyncApplication {

	public static void main(String[] args) {
		SpringApplication.run(UnisyncApplication.class, args);
	}

}
