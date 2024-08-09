import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentService } from 'src/app/services/document/document.service';
import { DepartmentService } from 'src/app/services/department/department.service';
import { UserService } from 'src/app/services/user/user.service';
import { TypeDocumentService } from 'src/app/services/type-document/type-document.service';
import { Departement } from 'src/app/models/Departement.model';
import { Users } from 'src/app/models/Users.model';
import { Router } from '@angular/router';
import { TypeDocument } from 'src/app/models/type-document.model';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit {
  documentForm: FormGroup;
  departments: Departement[] = [];
  users: Users[] = [];
  typeDocuments: TypeDocument[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private departmentService: DepartmentService,
    private userService: UserService,
    private typeDocumentService: TypeDocumentService,
    private router: Router
  ) {
    this.documentForm = this.fb.group({
      typeDocNom: ['', Validators.required],
      nomDoc: ['', Validators.required],
      nomClient: ['', Validators.required],
      numClient: ['', Validators.required],
      emailClient: ['', [Validators.required, Validators.email]],
      departementName: ['', Validators.required],
      userId: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadUsers();
    this.loadTypeDocuments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments: Departement[]) => this.departments = departments,
      error: (err: any) => console.error('Erreur lors du chargement des départements', err)
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: Users[]) => this.users = users,
      error: (err: any) => console.error('Erreur lors du chargement des utilisateurs', err)
    });
  }

  loadTypeDocuments(): void {
    this.typeDocumentService.getAllTypeDocuments().subscribe({
      next: (typeDocuments: TypeDocument[]) => this.typeDocuments = typeDocuments,
      error: (err: any) => console.error('Erreur lors du chargement des types de document', err)
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    console.log('Form submitted');  // Debugging statement
    
    if (this.documentForm.invalid || !this.selectedFile) {
      console.log('Form is invalid or no file selected');  // Debugging statement
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
  
    console.log('Form data being sent:', formData);  // Debugging statement
  
    this.documentService.createDocument(formData).subscribe({
      next: () => {
        console.log('Document successfully created');  // Debugging statement
        this.router.navigate(['/all-document-admin']);
      },
      error: (err: any) => console.error('Erreur lors de la création du document', err)
    });
  }
}  