import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-modal-eliminar-video',
  templateUrl: './modal-eliminar-video.component.html',
  styleUrl: './modal-eliminar-video.component.css'
})
export class ModalEliminarVideoComponent {

  constructor(public dialogRef: MatDialogRef<ModalEliminarVideoComponent>) {}


  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
