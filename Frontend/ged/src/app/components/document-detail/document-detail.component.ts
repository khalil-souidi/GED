import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from 'src/app/services/document/document.service';
import { Document } from 'src/app/models/Document.model';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {

  document: Document | undefined;

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private location: Location,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.documentService.getDocumentById(id).subscribe({
      next: (doc) => this.document = doc,
      error: (err) => console.error('Error fetching document details', err)
    });
  }

  downloadDocument() {
    const url = `http://your-backend-url/api/documents/${this.documentId}/file`; // Replace with your actual URL
    this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = ''; // Set the file name if needed
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    });
  }

  goBack(): void {
    this.location.back();
  }
}
