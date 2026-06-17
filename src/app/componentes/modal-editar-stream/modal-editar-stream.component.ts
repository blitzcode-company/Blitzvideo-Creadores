import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-editar-stream',
  templateUrl: './modal-editar-stream.component.html',
  styleUrl: './modal-editar-stream.component.css'
})
export class ModalEditarStreamComponent {

  titulo: string;
  descripcion: string;
  archivoMiniatura: File | null = null;
  previewMiniatura: string | null = null;
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private dialogRef: MatDialogRef<ModalEditarStreamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.titulo = data.titulo;
    this.descripcion = data.descripcion;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (!this.titulo || this.titulo.trim().length < 3) {
      return;
    }
    
    this.dialogRef.close({
      titulo: this.titulo,
      descripcion: this.descripcion,
      miniatura: this.archivoMiniatura,
      previewMiniatura: this.previewMiniatura
    });
  }

  onMiniaturaSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    
    if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
      alert('Solo se permiten imágenes JPG, JPEG o PNG');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar los 5MB');
      return;
    }

    this.archivoMiniatura = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewMiniatura = reader.result as string;
    };
    reader.readAsDataURL(this.archivoMiniatura);
  }
  
  removerMiniatura(): void {
    this.previewMiniatura = null;
    this.archivoMiniatura = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
  
  cancelarMiniatura(): void {
    this.removerMiniatura();
  }
}