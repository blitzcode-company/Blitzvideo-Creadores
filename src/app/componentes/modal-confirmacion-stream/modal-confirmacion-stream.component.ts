import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-modal-confirmacion-stream',
  templateUrl: './modal-confirmacion-stream.component.html',
  styleUrl: './modal-confirmacion-stream.component.css'
})
export class ModalConfirmacionStreamComponent {
  constructor(private dialogRef: MatDialogRef<ModalConfirmacionStreamComponent>) {}

  confirmar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }

}
