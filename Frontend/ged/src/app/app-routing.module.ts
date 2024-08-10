import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDocumentComponent } from './components/add-document/add-document.component';
import { AllDocumentAdminComponent } from './components/all-document-admin/all-document-admin.component';
import { DocumentDetailComponent } from './components/document-detail/document-detail.component';


const routes: Routes = [
  { path: 'all-document-admin', component: AllDocumentAdminComponent },
  { path: 'add-document', component: AddDocumentComponent },
  { path: 'document-detail/:id', component: DocumentDetailComponent },
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
