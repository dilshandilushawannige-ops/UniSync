package com.smartcampus.unisync.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class CustomAuthorizationRequestRepository implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    private final Map<String, OAuth2AuthorizationRequest> authorizationRequests = new HashMap<>();
    private final Map<String, String> pendingRoles = new HashMap<>();

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        String state = request.getParameter(OAuth2ParameterNames.STATE);
        if (state != null) {
            return authorizationRequests.get(state);
        }
        return null;
    }

    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest, HttpServletRequest request, 
                                        jakarta.servlet.http.HttpServletResponse response) {
        if (authorizationRequest == null) {
            removeAuthorizationRequest(request, response);
            return;
        }

        String state = authorizationRequest.getState();
        authorizationRequests.put(state, authorizationRequest);

        // Capture the role parameter from the request
        String roleParam = request.getParameter("role");
        System.out.println("=== Custom Authorization Repository ===");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Query String: " + request.getQueryString());
        System.out.println("Role parameter: " + roleParam);
        System.out.println("State: " + state);
        
        if (roleParam != null && !roleParam.isEmpty()) {
            pendingRoles.put(state, roleParam);
            // Also store in session as backup
            request.getSession().setAttribute("pendingOAuthRole", roleParam);
            request.getSession().setAttribute("oauthState", state);
            System.out.println("Stored role '" + roleParam + "' for state: " + state);
        }
        System.out.println("======================================");
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request, 
                                                                 jakarta.servlet.http.HttpServletResponse response) {
        String state = request.getParameter(OAuth2ParameterNames.STATE);
        if (state != null) {
            OAuth2AuthorizationRequest authRequest = authorizationRequests.remove(state);
            
            // Transfer the role to session for later retrieval
            String role = pendingRoles.remove(state);
            if (role != null) {
                request.getSession().setAttribute("pendingOAuthRole", role);
                System.out.println("=== Removing Authorization Request ===");
                System.out.println("Transferred role to session: " + role);
                System.out.println("=====================================");
            }
            
            return authRequest;
        }
        return null;
    }

    public String getRoleForState(String state) {
        return pendingRoles.get(state);
    }
}
