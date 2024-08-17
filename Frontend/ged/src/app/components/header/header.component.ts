import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/AuthService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  firstName: string | null = '';
  lastName: string | null = '';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.firstName = this.authService.getFirstName();
    this.lastName = this.authService.getLastName();
  }

  isDropdownVisible = false;

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
