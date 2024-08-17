import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatDialogModule } from '@angular/material/dialog';

// Import your components
import { AllDocumentAdminComponent } from './components/all-document-admin/all-document-admin.component';
import { DocumentDetailComponent } from './components/document-detail/document-detail.component';
import { AllDocumentUserComponent } from './components/all-document-user/all-document-user.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { StatistiqueComponent } from './components/statistique/statistique.component';
import { AddDocumentComponent } from './components/add-document/add-document.component';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { RejectionPopupComponent } from './components/rejection-popup/rejection-popup.component';
import { DeletePopupComponent } from './components/delete-popup/delete-popup.component';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './AuthService';
import { AuthGuard } from './AuthGuard';
import { authConfig } from './auth.config';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

@NgModule({
  declarations: [
    AppComponent,
    AllDocumentAdminComponent,
    AddDocumentComponent,
    DocumentDetailComponent,
    ConfirmationPopupComponent,
    AllDocumentUserComponent,
    ArchiveComponent,
    StatistiqueComponent,
    HomeComponent,
    HeaderComponent,
    RejectionPopupComponent,
    DeletePopupComponent,
    ForbiddenComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxChartsModule,
    MatDialogModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['http://localhost:91'],
        sendAccessToken: true,
      },
    }),
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
