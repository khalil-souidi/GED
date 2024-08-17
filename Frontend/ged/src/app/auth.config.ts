import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8180/realms/dev-Ged',
  redirectUri: window.location.origin,
  clientId: 'ged-front',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true,
  disablePKCE: false,
  requireHttps: false,
};

