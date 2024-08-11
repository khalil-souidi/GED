import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/document/document.service';
import { Document } from 'src/app/models/Document.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  archivedDocuments: Document[] = [];
  filteredArchivedDocuments: Document[] = [];
  currentPage = 1;
  documentsPerPage = 10;

  // Search criteria
  searchCodeUnique: string = '';
  searchType: string = '';
  sort: string = 'desc';  

  constructor(private documentService: DocumentService, private router: Router) {}

  ngOnInit(): void {
    this.loadArchivedDocuments();
  }

  loadArchivedDocuments(): void {
    this.documentService.getArchivedDocuments().subscribe({
      next: (docs: Document[]) => {
        this.archivedDocuments = docs;
        this.filteredArchivedDocuments = docs;
        this.onSearch(); // Apply initial search or sorting
      },
      error: (err) => console.error('Error fetching archived documents', err)
    });
  }

  onSearch(): void {
    let filteredDocs = this.archivedDocuments;

    if (this.searchCodeUnique) {
      filteredDocs = filteredDocs.filter(doc =>
        doc.codeUnique.toLowerCase().includes(this.searchCodeUnique.toLowerCase())
      );
    }

    if (this.searchType) {
      filteredDocs = filteredDocs.filter(doc =>
        doc.typeDoc.nom.toLowerCase().includes(this.searchType.toLowerCase())
      );
    }

    if (this.sort === 'desc') {
      filteredDocs.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
    } else {
      filteredDocs.sort((a, b) => new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime());
    }

    this.filteredArchivedDocuments = filteredDocs;
    this.currentPage = 1; // Reset to the first page after search
  }

  getPaginatedDocuments(): Document[] {
    const startIndex = (this.currentPage - 1) * this.documentsPerPage;
    return this.filteredArchivedDocuments.slice(startIndex, startIndex + this.documentsPerPage);
  }

  nextPage(): void {
    if (this.currentPage * this.documentsPerPage < this.filteredArchivedDocuments.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
