package com.example.ged;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication(scanBasePackages = "controllers")
public class GedApplication {
	public static void main(String[] args) {
		SpringApplication.run(GedApplication.class, args);
	}
}


