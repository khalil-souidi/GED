package com.example.ged.Security;

import com.example.ged.Entities.Departement;
import com.example.ged.Entities.Users;
import com.example.ged.Repository.DepartementRepository;
import com.example.ged.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class KeycloakUserSyncService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private DepartementRepository departementRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Scheduled(fixedRate = 60000) // Adjust the rate as needed (3600000 ms = 1 hour)
    public void syncUsersFromKeycloak() {
        String keycloakUrl = "http://localhost:8180/realms/dev-Ged/protocol/openid-connect/token";
        String clientId = "Ged-app";
        String clientSecret = "HamsKiMoiOIWpzHTBKGd4Ehr2QJWmgyS";
        String grantType = "client_credentials";

        // Create the request body
        MultiValueMap<String, String> tokenRequest = new LinkedMultiValueMap<>();
        tokenRequest.add("client_id", clientId);
        tokenRequest.add("client_secret", clientSecret);
        tokenRequest.add("grant_type", grantType);

        // Add headers for form-encoded request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);

        // Create the request entity
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(tokenRequest, headers);

        // Retrieve the access token
        Map<String, Object> response = restTemplate.postForObject(keycloakUrl, request, Map.class);
        String accessToken = (String) response.get("access_token");

        // Get users from Keycloak
        String usersUrl = "http://localhost:8180/admin/realms/dev-Ged/users";
        HttpHeaders authHeaders = new HttpHeaders();
        authHeaders.setBearerAuth(accessToken);

        HttpEntity<Void> authRequest = new HttpEntity<>(authHeaders);

        try {
            ResponseEntity<List> keycloakUsersResponse = restTemplate.exchange(usersUrl, HttpMethod.GET, authRequest, List.class);
            List<Map<String, Object>> keycloakUsers = keycloakUsersResponse.getBody();

            // Sync users with the database
            for (Map<String, Object> keycloakUser : keycloakUsers) {
                String userId = (String) keycloakUser.get("id");
                String username = (String) keycloakUser.get("username");
                String email = (String) keycloakUser.get("email");
                String firstName = (String) keycloakUser.get("firstName");
                String lastName = (String) keycloakUser.get("lastName");

                // Fetch user's group (department) information
                String groupsUrl = "http://localhost:8180/admin/realms/dev-Ged/users/" + userId + "/groups";
                ResponseEntity<List> groupsResponse = restTemplate.exchange(groupsUrl, HttpMethod.GET, authRequest, List.class);
                List<Map<String, Object>> groups = groupsResponse.getBody();
                Departement departement = null;

                if (groups != null && !groups.isEmpty()) {
                    Map<String, Object> groupMap = groups.get(0);
                    String departmentName = (String) groupMap.get("name");

                    Optional<Departement> departementOpt = departementRepository.findByName(departmentName);
                    if (departementOpt.isPresent()) {
                        departement = departementOpt.get();
                    } else {
                        departement = new Departement();
                        departement.setName(departmentName);
                        departement = departementRepository.save(departement); // Save the new department
                    }
                }

                Users user = usersRepository.findByEmail(email).orElse(new Users());
                user.setUsername(username);
                user.setEmail(email);
                user.setPrenom(firstName);
                user.setNom(lastName);
                user.setDepartment(departement);

                usersRepository.save(user);
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Handle the exception as needed, possibly log it
        }
    }
}
