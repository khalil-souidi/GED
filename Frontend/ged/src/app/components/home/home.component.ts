import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Security/AuthService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router, private authService: AuthService) { }

  navigateToDocuments(): void {
    if (this.authService.hasRole('admin')) {
      this.router.navigate(['all-document-admin']);
    } else if (this.authService.hasRole('user')) {
      this.router.navigate(['all-document-user']);
    }
    else {
      // If the user is not logged in, redirect to the login page
      this.authService.login();
    }
  }

  navigateToArchive(): void {
    this.router.navigate(['archive']);
  }
}
