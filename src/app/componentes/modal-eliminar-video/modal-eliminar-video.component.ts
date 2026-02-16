import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-modal-eliminar-video',
  templateUrl: './modal-eliminar-video.component.html',
  styleUrl: './modal-eliminar-video.component.css'
})
export class ModalEliminarVideoComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalEliminarVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  get esMultiple(): boolean {
    return this.data?.multiple === true;
  }

  get cantidadVideos(): number {
    return this.data?.count || 1;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
