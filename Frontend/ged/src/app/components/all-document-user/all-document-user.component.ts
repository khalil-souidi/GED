import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/document/document.service';
import { Document } from 'src/app/models/Document.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-document-user',
  templateUrl: './all-document-user.component.html',
  styleUrls: ['./all-document-user.component.css']
})
export class AllDocumentUserComponent implements OnInit {
  documentsEnTraitement: Document[] = [];
  documentsCloture: Document[] = [];

  // Pagination settings
  currentPageEnTraitement: number = 1;
  currentPageCloture: number = 1;
  documentsPerPage: number = 5;

  constructor(private documentService: DocumentService, private router : Router) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    const department = 'Rh';

    // Fetch documents in "EnTraitement" stage
    this.documentService.getDocumentsByDepartmentAndWorkflow(department, 'TRAITEMENT').subscribe({
      next: (docs: Document[]) => {
        console.log('Documents En Traitement:', docs); // Add this line
        this.documentsEnTraitement = docs;
      },
      error: (err) => console.error('Error fetching documents in treatment stage', err)
    });

    
    

    // Fetch documents in "Cloture" stage
    this.documentService.getDocumentsByDepartmentAndWorkflow(department, 'CLOTURE').subscribe({
      next: (docs: Document[]) => this.documentsCloture = docs,
      error: (err) => console.error('Error fetching closed documents', err)
    });
  }

  // Pagination methods for "EnTraitement"
  getPaginatedEnTraitement(): Document[] {
    const startIndex = (this.currentPageEnTraitement - 1) * this.documentsPerPage;
    return this.documentsEnTraitement.slice(startIndex, startIndex + this.documentsPerPage);
  }

  nextPageEnTraitement(): void {
    this.currentPageEnTraitement++;
  }

  prevPageEnTraitement(): void {
    if (this.currentPageEnTraitement > 1) {
      this.currentPageEnTraitement--;
    }
  }

  // Pagination methods for "Cloture"
  getPaginatedCloture(): Document[] {
    const startIndex = (this.currentPageCloture - 1) * this.documentsPerPage;
    return this.documentsCloture.slice(startIndex, startIndex + this.documentsPerPage);
  }

  nextPageCloture(): void {
    this.currentPageCloture++;
  }

  prevPageCloture(): void {
    if (this.currentPageCloture > 1) {
      this.currentPageCloture--;
    }
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
  
}
