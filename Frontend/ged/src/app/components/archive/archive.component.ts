import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/document/document.service';
import { Document } from 'src/app/models/Document.model';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  archivedDocuments: Document[] = [];
  currentPage = 1;
  documentsPerPage = 10;

  // Search criteria
  searchCodeUnique: string = '';
  searchType: string = '';
  searchDate: string = '';
  sort: string = 'desc';  

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadArchivedDocuments();
  }

  loadArchivedDocuments(): void {
    this.documentService.getArchivedDocuments().subscribe({
      next: (docs: Document[]) => this.archivedDocuments = docs,
      error: (err) => console.error('Error fetching archived documents', err)
    });
  }

  onSearch(): void {
    this.documentService.searchDocuments(undefined, this.searchType, this.searchCodeUnique, this.searchDate, undefined, this.sort)
      .subscribe({
        next: (docs: Document[]) => this.archivedDocuments = docs,
        error: (err) => console.error('Error searching archived documents', err)
      });
  }

  getPaginatedDocuments(): Document[] {
    const startIndex = (this.currentPage - 1) * this.documentsPerPage;
    return this.archivedDocuments.slice(startIndex, startIndex + this.documentsPerPage);
  }

  nextPage(): void {
    if (this.currentPage * this.documentsPerPage < this.archivedDocuments.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
