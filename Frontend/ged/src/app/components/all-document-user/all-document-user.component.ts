import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/document/document.service';
import { Document } from 'src/app/models/Document.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/AuthService';
import { UserDepartmentService } from 'src/app/services/userDTO/user-department.service';

@Component({
  selector: 'app-all-document-user',
  templateUrl: './all-document-user.component.html',
  styleUrls: ['./all-document-user.component.css']
})
export class AllDocumentUserComponent implements OnInit {
  documentsEnTraitement: Document[] = [];
  documentsCloture: Document[] = [];

  // Filtered documents for search
  filteredEnTraitement: Document[] = [];
  filteredCloture: Document[] = [];

  // Pagination settings
  currentPageEnTraitement: number = 1;
  currentPageCloture: number = 1;
  documentsPerPage: number = 5;

  searchCodeUnique: string = '';
  departmentName: string | null = '';

  constructor(
    private documentService: DocumentService, 
    private router: Router,
    private authService: AuthService, 
    private userDepartmentService: UserDepartmentService
  ) {}

  ngOnInit(): void {
    const email = this.authService.identityClaims?.['email']; // Use bracket notation to access 'email'
    if (email) {
      this.userDepartmentService.getUserDepartment(email).subscribe({
        next: (response) => {
          this.departmentName = response.departmentName;
          this.loadDocuments();  // Only load documents after departmentName is available
        },
        error: (err) => {
          console.error('Error fetching department:', err);
        }
      });
    } else {
      console.error('User email is not available.');
    }
  }

  loadDocuments(): void {
    const department = this.departmentName as string; // This will ensure department is a string

    // Fetch documents in "EnTraitement" stage
    this.documentService.getDocumentsByDepartmentAndWorkflow(department, 'TRAITEMENT').subscribe({
      next: (docs: Document[]) => {
        this.documentsEnTraitement = docs;
        this.filteredEnTraitement = docs;
      },
      error: (err) => console.error('Error fetching documents in treatment stage', err)
    });

    // Fetch documents in "Cloture" stage
    this.documentService.getDocumentsByDepartmentAndWorkflow(department, 'CLOTURE').subscribe({
      next: (docs: Document[]) => {
        this.documentsCloture = docs;
        this.filteredCloture = docs;
      },
      error: (err) => console.error('Error fetching closed documents', err)
    });
  }

  // Method to get paginated documents
  getPaginatedDocuments(documents: Document[], currentPage: number): Document[] {
    const startIndex = (currentPage - 1) * this.documentsPerPage;
    return documents.slice(startIndex, startIndex + this.documentsPerPage);
  }

  filterDocuments(): void {
    const searchTerm = this.searchCodeUnique.toLowerCase();

    this.filteredEnTraitement = this.documentsEnTraitement.filter(doc =>
      doc.codeUnique.toLowerCase().includes(searchTerm)
    );
    this.filteredCloture = this.documentsCloture.filter(doc =>
      doc.codeUnique.toLowerCase().includes(searchTerm)
    );
  }

  closeWorkflow(documentId: number): void {
    this.documentService.closeWorkflow(documentId).subscribe({
      next: () => this.loadDocuments(),  // Reload documents after closing workflow
      error: (err) => console.error('Error closing workflow', err)
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  // Pagination methods for "EnTraitement"
  nextPageEnTraitement(): void {
    this.currentPageEnTraitement++;
  }

  prevPageEnTraitement(): void {
    if (this.currentPageEnTraitement > 1) {
      this.currentPageEnTraitement--;
    }
  }

  // Pagination methods for "Cloture"
  nextPageCloture(): void {
    this.currentPageCloture++;
  }

  prevPageCloture(): void {
    if (this.currentPageCloture > 1) {
      this.currentPageCloture--;
    }
  }
}
