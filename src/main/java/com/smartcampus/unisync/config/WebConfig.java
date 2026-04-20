package com.smartcampus.unisync.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Get the absolute path to the uploads directory
        String uploadPath = Paths.get("uploads").toAbsolutePath().toUri().toString();
        
        // Map /uploads/** URLs to the actual uploads folder on disk
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}
