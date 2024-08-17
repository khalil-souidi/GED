import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private oauthService: OAuthService, private router: Router) {
    this.configure();
  }

  private configure() {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin({
      onTokenReceived: (context) => {
        console.log("Token received:", context);
        this.router.navigate(['/all-document-admin']);
      },
      onLoginError: (err) => {
        console.error("Error during login:", err);
        this.router.navigate(['/home']);
      }
    });

    // Set up automatic silent refresh to ensure token refresh before expiry
    this.oauthService.setupAutomaticSilentRefresh();
  }

  public login() {
    this.oauthService.initLoginFlow();
  }

  public logout() {
    this.oauthService.logOut();
  }

  public get identityClaims() {
    return this.oauthService.getIdentityClaims();
  }

  public get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }

  public handleLoginCallback() {
    this.oauthService.loadDiscoveryDocumentAndTryLogin({
      onTokenReceived: context => {
        console.log("Token received:", context);
        this.router.navigate(['/home']);
      },
      onLoginError: err => {
        console.error("Error during login:", err);
        this.router.navigate(['/home']);
      }
    });
  }

  public getFirstName(): string | null {
    const claims: any = this.oauthService.getIdentityClaims();
    return claims ? claims.given_name : null;
  }
  public getLastName(): string | null {
    const claims: any = this.oauthService.getIdentityClaims();
    return claims ? claims.family_name : null;
  }
  
}
