import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllDocumentAdminComponent } from './components/all-document-admin/all-document-admin.component';

const routes: Routes = [
  { path: 'all-document-admin', component: AllDocumentAdminComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
