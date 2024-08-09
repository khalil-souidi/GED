import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/Document.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-document-admin',
  templateUrl: './all-document-admin.component.html',
  styleUrls: ['./all-document-admin.component.css']
})
export class AllDocumentAdminComponent implements OnInit {
  enCoursDocuments: Document[] = [];
  approuveDocuments: Document[] = [];
  refuseDocuments: Document[] = [];

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
}
