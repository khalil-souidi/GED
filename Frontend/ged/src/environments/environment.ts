// src/environments/environment.ts
export const environment = {
    production: false,
    keycloak: {
      url: 'http://localhost:8180',  // Keycloak server URL
      realm: 'dev-Ged',                  // Your Keycloak realm
      clientId: 'Ged-app',               // Your Keycloak client ID
    },
  };
  