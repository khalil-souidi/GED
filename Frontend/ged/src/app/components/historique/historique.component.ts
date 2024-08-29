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
  filteredAuditLogs: AuditLog[] = [];
  userId: number | null = null;
  connectedUserEmail: string = '';
  
  // Variables pour les filtres
  filterDocumentName: string = '';
  filterDate: string = '';
  filterCodeUnique: string = ''; // Add this field for codeUnique filtering

  constructor(
    private auditLogService: AuditLogService,
    private userDepartmentService: UserDepartmentService,
    private authService: AuthService,
    private router: Router
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
          this.applyFilters(); // Appliquer les filtres dès que les données sont récupérées
        },
        error: (error) => {
          console.error('Error fetching audit logs:', error);
        }
      });
    }
  }

  // Appliquer les filtres
  applyFilters(): void {
    this.filteredAuditLogs = this.auditLogs.filter(log => {
      const matchesDocumentName = log.documentName.toLowerCase().includes(this.filterDocumentName.toLowerCase());
      const matchesCodeUnique = log.codeUnique.toLowerCase().includes(this.filterCodeUnique.toLowerCase());
      const matchesDate = this.filterDate ? new Date(log.timestamp).toLocaleDateString() === new Date(this.filterDate).toLocaleDateString() : true;
      return matchesDocumentName && matchesCodeUnique && matchesDate;
    });
  }

  // Réinitialiser les filtres
  clearFilters(): void {
    this.filterDocumentName = '';
    this.filterCodeUnique = ''; // Clear the codeUnique filter
    this.filterDate = '';
    this.applyFilters();
  }

  // Navigation
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
