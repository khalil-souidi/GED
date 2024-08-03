package com.example.ged.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class UserController {

    @GetMapping("/api/session")
    public Map<String, Object> getUserSession(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        Object principal = authentication.getPrincipal();

        if (principal instanceof OidcUser) {
            OidcUser oidcUser = (OidcUser) principal;
            populateResponseWithAttributes(response, oidcUser.getAttributes(), oidcUser.getAuthorities().stream().map(Object::toString).collect(Collectors.toSet()));
        } else if (principal instanceof DefaultOAuth2User) {
            DefaultOAuth2User oauth2User = (DefaultOAuth2User) principal;
            populateResponseWithAttributes(response, oauth2User.getAttributes(), oauth2User.getAuthorities().stream().map(Object::toString).collect(Collectors.toSet()));
        }

        return response;
    }

    private void populateResponseWithAttributes(Map<String, Object> response, Map<String, Object> attributes, Set<String> authorities) {
        response.put("username", attributes.get("preferred_username"));
        response.put("email", attributes.get("email"));
        response.put("first_name", attributes.get("given_name"));
        response.put("last_name", attributes.get("family_name"));
    }
}
