// src/app/services/keycloak-security.service.ts
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class KeycloakSecurityService {
  constructor(private keycloakService: KeycloakService) {}

  async init(): Promise<void> {
    try {
      await this.keycloakService.init({
        config: {
          url: environment.keycloak.url,
          realm: environment.keycloak.realm,
          clientId: environment.keycloak.clientId,
        },
        initOptions: {
          onLoad: 'login-required',
          checkLoginIframe: false,
        },
      });
    } catch (error) {
      console.error('Keycloak initialization failed', error);
    }
  }
}
