import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-confirmar-dialogo',
  templateUrl: './confirmar-dialogo.component.html',
  styleUrl: './confirmar-dialogo.component.css'
})
export class ConfirmarDialogoComponent {
constructor(
    public dialogRef: MatDialogRef<ConfirmarDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
