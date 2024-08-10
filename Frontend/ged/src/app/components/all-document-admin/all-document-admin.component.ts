import { Component, OnInit } from '@angular/core';
import { Document } from '../../models/Document.model';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/document/document.service';

@Component({
  selector: 'app-all-document-admin',
  templateUrl: './all-document-admin.component.html',
  styleUrls: ['./all-document-admin.component.css']
})
export class AllDocumentAdminComponent implements OnInit {
  enCoursDocuments: Document[] = [];
  approuveDocuments: Document[] = [];
  refuseDocuments: Document[] = [];

  // Pagination properties
  currentPageEnCours = 1;
  currentPageApprouve = 1;
  currentPageRefuse = 1;
  documentsPerPage = 5;

  constructor(private documentService: DocumentService, private router: Router) { }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getDocumentsByStatus('En_COURS').subscribe({
      next: (docs: Document[]) => this.enCoursDocuments = docs,
      error: err => console.error('Erreur lors du chargement des documents en cours', err)
    });

    this.documentService.getDocumentsByStatus('APPROUVÉ').subscribe({
      next: (docs: Document[]) => this.approuveDocuments = docs,
      error: err => console.error('Erreur lors du chargement des documents approuvés', err)
    });

    this.documentService.getDocumentsByStatus('REFUSÉ').subscribe({
      next: (docs: Document[]) => this.refuseDocuments = docs,
      error: err => console.error('Erreur lors du chargement des documents refusés', err)
    });
  }

  // Method to get paginated documents
  getPaginatedDocuments(documents: Document[], currentPage: number): Document[] {
    const startIndex = (currentPage - 1) * this.documentsPerPage;
    return documents.slice(startIndex, startIndex + this.documentsPerPage);
  }

  approveDocument(document: Document): void {
    this.documentService.updateDocumentStatus(document.id,'APPROUVÉ','').subscribe(() => this.loadDocuments());
  }

  refuseDocument(document: Document): void {
    this.documentService.updateDocumentStatus(document.id, 'REFUSÉ', '')
      .subscribe({
        next: () => this.loadDocuments(),
        error: err => console.error('Erreur lors de la mise à jour du statut du document', err)
      });
  }

  navigateToAddDocument(): void {
    this.router.navigate(['/add-document']);
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
