import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentService } from 'src/app/services/document/document.service';
import { DepartmentService } from 'src/app/services/department/department.service';
import { TypeDocumentService } from 'src/app/services/type-document/type-document.service';
import { Departement } from 'src/app/models/Departement.model';
import { TypeDocument } from 'src/app/models/type-document.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { UserDepartmentService } from 'src/app/services/userDTO/user-department.service';
import { AuthService } from 'src/app/AuthService';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit {
  documentForm: FormGroup;
  departments: Departement[] = [];
  typeDocuments: TypeDocument[] = [];
  selectedFile: File | null = null;
  connectedUserEmail: string = ''; 
  connectedUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private departmentService: DepartmentService,
    private userDepartmentService: UserDepartmentService,
    private typeDocumentService: TypeDocumentService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.documentForm = this.fb.group({
      typeDocNom: ['', Validators.required],
      nomDoc: ['', Validators.required],
      nomClient: ['', Validators.required],
      numClient: ['', Validators.required],
      emailClient: ['', [Validators.required, Validators.email]],
      departementName: ['', Validators.required],
      userId: ['', Validators.required],
      userEmail: [{ value: '', disabled: true }, Validators.required],
    });
  }
  

  ngOnInit(): void {
    this.loadDepartments();
    this.loadTypeDocuments();
    this.loadConnectedUserDetails();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments: Departement[]) => this.departments = departments,
      error: (err: any) => console.error('Erreur lors du chargement des départements', err)
    });
  }

  loadTypeDocuments(): void {
    this.typeDocumentService.getAllTypeDocuments().subscribe({
      next: (typeDocuments: TypeDocument[]) => this.typeDocuments = typeDocuments,
      error: (err: any) => console.error('Erreur lors du chargement des types de document', err)
    });
  }

  loadConnectedUserDetails(): void {
    this.connectedUserEmail = this.authService.getUserEmail();
  
    this.userDepartmentService.getUserDepartment(this.connectedUserEmail).subscribe({
      next: (user) => {
        this.connectedUserEmail = user.email;
        this.connectedUserId = user.id;
        this.documentForm.patchValue({
          userId: this.connectedUserId,
          userEmail: this.connectedUserEmail,
        });
      },
      error: (err: any) => console.error('Erreur lors du chargement des détails de l\'utilisateur', err)
    });
  }
  
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const fileDropArea = event.currentTarget as HTMLElement;
    fileDropArea.classList.add('hover');
  }

  onDragLeave(event: DragEvent): void {
    const fileDropArea = event.currentTarget as HTMLElement;
    fileDropArea.classList.remove('hover');
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const fileDropArea = event.currentTarget as HTMLElement;
    fileDropArea.classList.remove('hover');

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  isFileInvalid(): boolean {
    return !this.selectedFile && this.documentForm.get('file')?.touched!;
  }

  markAllAsTouched(): void {
    this.documentForm.markAllAsTouched();
  }

  onSubmit(): void {
    this.markAllAsTouched();
    if (this.documentForm.invalid || !this.selectedFile) {
      console.log('Form is invalid or no file selected');
      return;
    }
  
    const formData = new FormData();
    formData.append('typeDocNom', this.documentForm.get('typeDocNom')?.value);
    formData.append('nomDoc', this.documentForm.get('nomDoc')?.value);
    formData.append('nomClient', this.documentForm.get('nomClient')?.value);
    formData.append('numClient', this.documentForm.get('numClient')?.value);
    formData.append('emailClient', this.documentForm.get('emailClient')?.value);
    formData.append('departementName', this.documentForm.get('departementName')?.value);
    formData.append('userId', this.documentForm.get('userId')?.value);
    formData.append('file', this.selectedFile);
  
    this.documentService.saveDocument(formData).subscribe({
      next: (response) => {
        this.dialog.open(ConfirmationPopupComponent, {
          data: {
            dossierNumber: response.codeUnique,
          }
        });
        this.router.navigate(['/all-document-admin']);
      },
      error: (err: any) => console.error('Error creating document', err)
    });
  }
  
}
