// src/app/app.module.ts
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeycloakAngularModule } from 'keycloak-angular';
import { KeycloakSecurityService } from './Services/keycloak.service';

function initializeKeycloak(keycloakSecurityService: KeycloakSecurityService) {
  return () => keycloakSecurityService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    // other components
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakSecurityService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
