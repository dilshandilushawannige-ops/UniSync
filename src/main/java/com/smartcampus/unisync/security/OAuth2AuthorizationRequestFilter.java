package com.smartcampus.unisync.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthorizationRequestFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        // Check if this is an OAuth2 authorization request
        String requestURI = httpRequest.getRequestURI();
        System.out.println("=== OAuth2 Filter - Request URI: " + requestURI);
        
        if (requestURI != null && requestURI.contains("/oauth2/authorization/")) {
            // Get the role parameter from the query string
            String roleParam = httpRequest.getParameter("role");
            
            System.out.println("=== OAuth2 Authorization Filter ===");
            System.out.println("Full URL: " + httpRequest.getRequestURL() + "?" + httpRequest.getQueryString());
            System.out.println("Role parameter received: " + roleParam);
            
            if (roleParam != null && !roleParam.isEmpty()) {
                System.out.println("Storing role in session: " + roleParam);
                // Store the role in the session
                httpRequest.getSession().setAttribute("pendingOAuthRole", roleParam);
                System.out.println("Session ID: " + httpRequest.getSession().getId());
                System.out.println("Role stored successfully in session");
            } else {
                System.out.println("WARNING: No role parameter found in request!");
            }
            System.out.println("===================================");
        }
        
        chain.doFilter(request, response);
    }
}
