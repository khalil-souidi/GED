import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllDocumentAdminComponent } from './components/all-document-admin/all-document-admin.component';
import { HttpClientModule } from '@angular/common/http';
import { AddDocumentComponent } from './components/add-document/add-document.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AllDocumentAdminComponent,
    AddDocumentComponent  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  
    ReactiveFormsModule,
    HttpClientModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
