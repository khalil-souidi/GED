import { Component, OnInit } from '@angular/core';
import { Document } from '../../models/Document.model';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/document/document.service';
import { MatDialog } from '@angular/material/dialog';
import { RejectionPopupComponent } from '../rejection-popup/rejection-popup.component';

@Component({
  selector: 'app-all-document-admin',
  templateUrl: './all-document-admin.component.html',
  styleUrls: ['./all-document-admin.component.css']
})
export class AllDocumentAdminComponent implements OnInit {
  enCoursDocuments: Document[] = [];
  approuveDocuments: Document[] = [];
  refuseDocuments: Document[] = [];

  // Filtered documents for search
  filteredEnCoursDocuments: Document[] = [];
  filteredApprouveDocuments: Document[] = [];
  filteredRefuseDocuments: Document[] = [];

  // Pagination properties
  currentPageEnCours = 1;
  currentPageApprouve = 1;
  currentPageRefuse = 1;
  documentsPerPage = 5;

  searchCodeUnique: string = '';

  constructor(private documentService: DocumentService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getDocumentsByStatus('En_COURS').subscribe({
      next: (docs: Document[]) => {
        this.enCoursDocuments = docs;
        this.filteredEnCoursDocuments = docs;
      },
      error: err => console.error('Erreur lors du chargement des documents en cours', err)
    });

    this.documentService.getDocumentsByStatus('APPROUVÉ').subscribe({
      next: (docs: Document[]) => {
        this.approuveDocuments = docs;
        this.filteredApprouveDocuments = docs;
      },
      error: err => console.error('Erreur lors du chargement des documents approuvés', err)
    });

    this.documentService.getDocumentsByStatus('REFUSÉ').subscribe({
      next: (docs: Document[]) => {
        this.refuseDocuments = docs;
        this.filteredRefuseDocuments = docs;
      },
      error: err => console.error('Erreur lors du chargement des documents refusés', err)
    });
  }

  // Method to get paginated documents
  getPaginatedDocuments(documents: Document[], currentPage: number): Document[] {
    const startIndex = (currentPage - 1) * this.documentsPerPage;
    return documents.slice(startIndex, startIndex + this.documentsPerPage);
  }

  filterDocuments(): void {
    const searchTerm = this.searchCodeUnique.toLowerCase();

    this.filteredEnCoursDocuments = this.enCoursDocuments.filter(doc =>
      doc.codeUnique.toLowerCase().includes(searchTerm)
    );
    this.filteredApprouveDocuments = this.approuveDocuments.filter(doc =>
      doc.codeUnique.toLowerCase().includes(searchTerm)
    );
    this.filteredRefuseDocuments = this.refuseDocuments.filter(doc =>
      doc.codeUnique.toLowerCase().includes(searchTerm)
    );
  }

  approveDocument(document: Document): void {
    this.documentService.updateDocumentStatus(document.id, 'APPROUVÉ', '')
      .subscribe(() => this.loadDocuments());
  }

  refuseDocument(document: Document): void {
    const dialogRef = this.dialog.open(RejectionPopupComponent, {
      width: '300px',
      data: { document }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documentService.updateDocumentStatus(document.id, 'REFUSÉ', result)
          .subscribe({
            next: () => this.loadDocuments(),
            error: err => console.error('Erreur lors de la mise à jour du statut du document', err)
          });
      }
    });
  }

  deleteDocument(document: Document): void {
    if (confirm(`Are you sure you want to delete the document: ${document.nomDoc}?`)) {
      this.documentService.deleteDocument(document.id).subscribe({
        next: () => this.loadDocuments(),
        error: err => console.error('Erreur lors de la suppression du document', err)
      });
    }
  }

  navigateToAddDocument(): void {
    this.router.navigate(['/add-document']);
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  // Methods for pagination
  nextPageEnCours(): void {
    this.currentPageEnCours++;
  }

  prevPageEnCours(): void {
    if (this.currentPageEnCours > 1) this.currentPageEnCours--;
  }

  nextPageApprouve(): void {
    this.currentPageApprouve++;
  }

  prevPageApprouve(): void {
    if (this.currentPageApprouve > 1) this.currentPageApprouve--;
  }

  nextPageRefuse(): void {
    this.currentPageRefuse++;
  }

  prevPageRefuse(): void {
    if (this.currentPageRefuse > 1) this.currentPageRefuse--;
  }
  
}
