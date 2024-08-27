import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDocumentComponent } from './components/add-document/add-document.component';
import { AllDocumentAdminComponent } from './components/all-document-admin/all-document-admin.component';
import { DocumentDetailComponent } from './components/document-detail/document-detail.component';
import { AllDocumentUserComponent } from './components/all-document-user/all-document-user.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { StatistiqueComponent } from './components/statistique/statistique.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './Security/AuthGuard';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { HistoriqueComponent } from './components/historique/historique.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'all-document-admin', component: AllDocumentAdminComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' }},
  { path: 'add-document', component: AddDocumentComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin'} },
  { path: 'document-detail/:id', component: DocumentDetailComponent, canActivate: [AuthGuard] },
  { path: 'all-document-user', component: AllDocumentUserComponent, canActivate: [AuthGuard] },
  { path: 'statistique', component: StatistiqueComponent, canActivate: [AuthGuard] },
  { path: 'archive', component: ArchiveComponent, canActivate: [AuthGuard] },
  { path: 'historique', component: HistoriqueComponent, canActivate: [AuthGuard] },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
