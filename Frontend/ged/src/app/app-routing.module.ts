// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SecuredComponent } from './Components/secured/secured.component';
import { AuthGuard } from './AuthGuard';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'secured', component: SecuredComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
