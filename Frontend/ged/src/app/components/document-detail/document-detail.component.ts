import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from 'src/app/services/document/document.service';
import { Document } from 'src/app/models/Document.model';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { DocumentStatus } from 'src/app/models/DocumentStatus.model';
import { EtapeWorkflow } from 'src/app/models/EtapeWorkflow.model';

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
    if (this.document?.id) {
      const url = `http://localhost:91/api/documents/${this.document.id}/file`; // Replace with your actual URL
      this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = this.document?.nomDoc || 'document'; // Set the file name using the document name
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
      });
    } else {
      console.error("Document ID is not available.");
    }
  }

  goBack(): void {
    this.location.back();
  }

  getWorkflowStepClass(step: EtapeWorkflow): string {
    if (this.document?.workflow.etapeCourante === step) {
      return 'complete';
    }
    return '';
  }
}
