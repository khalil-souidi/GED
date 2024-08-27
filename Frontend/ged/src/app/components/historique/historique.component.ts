import { Component, OnInit } from '@angular/core';
import { AuditLog } from '../../models/AuditLog.model';
import { UserDepartmentService } from 'src/app/services/userDTO/user-department.service';
import { AuditLogService } from 'src/app/services/auditlog/auditlog.service';
import { AuthService } from 'src/app/Security/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  userId: number | null = null;
  connectedUserEmail: string = '';

  constructor(
    private auditLogService: AuditLogService,
    private userDepartmentService: UserDepartmentService,
    private authService: AuthService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.loadConnectedUserDetails();
  }

  loadConnectedUserDetails(): void {
    this.connectedUserEmail = this.authService.getUserEmail();

    this.userDepartmentService.getUserDepartment(this.connectedUserEmail).subscribe({
      next: (user) => {
        this.userId = user.id;
        this.getAuditLogsByUserId();
      },
      error: (err: any) => console.error('Erreur lors du chargement des détails de l\'utilisateur', err)
    });
  }

  getAuditLogsByUserId(): void {
    if (this.userId !== null) {
      this.auditLogService.getAuditLogsByUserId(this.userId).subscribe({
        next: (logs) => {
          this.auditLogs = logs;
        },
        error: (error) => {
          console.error('Error fetching audit logs:', error);
        }
      });
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
