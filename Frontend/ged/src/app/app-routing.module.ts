import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDocumentComponent } from './components/add-document/add-document.component';

const routes: Routes = [
  { path: 'all-document-admin', component: AddDocumentComponent },
  { path: 'add-document', component: AddDocumentComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
