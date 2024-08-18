import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { UserDepartmentService } from 'src/app/services/userDTO/user-department.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  firstName: string | null = '';
  lastName: string | null = '';
  departmentName: string | null = '';

  constructor(public authService: AuthService, private userDepartmentService: UserDepartmentService) {}

  ngOnInit(): void {
    this.firstName = this.authService.getFirstName();
    this.lastName = this.authService.getLastName();
  
    const email = this.authService.identityClaims?.['email']; // Use bracket notation to access 'email'
    if (email) {
      this.userDepartmentService.getUserDepartment(email).subscribe({
        next: (response) => {
          this.departmentName = response.departmentName;
        },
        error: (err) => {
          console.error('Error fetching department:', err);
        }
      });
    } else {
      console.error('User email is not available.');
    }
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
