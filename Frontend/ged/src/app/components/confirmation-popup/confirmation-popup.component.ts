import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.css']
})
export class ConfirmationPopupComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dossierNumber: string },
    private dialogRef: MatDialogRef<ConfirmationPopupComponent>,
    private router: Router
  ) {}

  closePopup() {
    this.dialogRef.close();  // Close the dialog
    this.router.navigate(['/all-document-admin']);  // Redirect to "all documents" page
  }
}
