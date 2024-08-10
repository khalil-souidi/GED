import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDocumentComponent } from './components/add-document/add-document.component';
import { AllDocumentAdminComponent } from './components/all-document-admin/all-document-admin.component';
import { DocumentDetailComponent } from './components/document-detail/document-detail.component';
import { AllDocumentUserComponent } from './components/all-document-user/all-document-user.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { StatistiqueComponent } from './components/statistique/statistique.component';

const routes: Routes = [
  { path: 'all-document-admin', component: AllDocumentAdminComponent },
  { path: 'add-document', component: AddDocumentComponent },
  { path: 'document-detail/:id', component: DocumentDetailComponent },
    { path: 'all-document-user', component: AllDocumentUserComponent },
  { path: 'statistique', component: StatistiqueComponent },
  { path: 'archive', component: ArchiveComponent },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
