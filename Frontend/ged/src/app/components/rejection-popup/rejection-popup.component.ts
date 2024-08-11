import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rejection-popup',
  templateUrl: './rejection-popup.component.html',
  styleUrls: ['./rejection-popup.component.css']
})
export class RejectionPopupComponent {
  rejectionMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<RejectionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitRejection(): void {
    this.dialogRef.close(this.rejectionMessage);
  }
}
