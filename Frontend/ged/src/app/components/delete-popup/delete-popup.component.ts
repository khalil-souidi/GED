import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.css']
})
export class DeletePopupComponent {
  constructor(
    public dialogRef: MatDialogRef<DeletePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nomDoc: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
