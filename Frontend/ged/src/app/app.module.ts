import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AppComponent } from './app.component';
import { AllDocumentAdminComponent } from './components/all-document-admin/all-document-admin.component';
import { HttpClientModule } from '@angular/common/http';
import { AddDocumentComponent } from './components/add-document/add-document.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentDetailComponent } from './components/document-detail/document-detail.component';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    AllDocumentAdminComponent,
    AddDocumentComponent,
    DocumentDetailComponent,
    ConfirmationPopupComponent  
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    AppRoutingModule,  
    ReactiveFormsModule,
    HttpClientModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
