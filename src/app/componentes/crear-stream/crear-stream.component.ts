import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StreamService } from '../../servicios/stream.service';
import { AuthService } from '../../servicios/auth.service';
import { ModalConfirmacionStreamComponent } from '../modal-confirmacion-stream/modal-confirmacion-stream.component';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { SidebarService } from '../../servicios/sidebar.service';


@Component({
  selector: 'app-crear-stream',
  templateUrl: './crear-stream.component.html',
  styleUrl: './crear-stream.component.css'
})
export class CrearStreamComponent implements OnInit {

  streamForm: FormGroup;
  selectedFile: File | null = null;
  canalId: any;
  usuario: any;
  canal: any;
  canalNombre: any;
  thumbnailPreview: string | null = null;
  uploadProgress: number = 0;
  uploading: boolean = false;
    sidebarCollapsed$!: Observable<boolean>;
  
  ngOnInit() {
    this.obtenerUsuario();
        this.sidebarCollapsed$ = this.sidebarService.sidebarCollapsed$;

  }

  constructor(
    private fb: FormBuilder,
    private streamService: StreamService,
    private dialog: MatDialog,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private sidebarService: SidebarService,
    private router: Router,
    private title: Title
  ) {
    this.streamForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      
    });
    this.title.setTitle("Crear stream - BlitzStudio");

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => this.thumbnailPreview = e.target?.result as string;
      reader.readAsDataURL(file);
    } else {
      this.snackBar.open('Solo se permiten imágenes', 'Cerrar', { duration: 3000 });
    }
  }
 
  obtenerUsuario() {
    this.authService.mostrarUserLogueado().subscribe((res) => {
      this.usuario = res;
      this.obtenerCanal();
    });
  }

  obtenerCanal() {
    this.authService.obtenerCanalDelUsuario(this.usuario.id).subscribe((res: any) => {
      this.canal = res;
      if (res.canales) {
        this.canalId = res.canales.id;
        this.canalNombre = res.canales.nombre;      
      } else {
        console.error('El usuario no tiene canal creado');
      }
    });
  }

  crearStream() {
    if (!this.canalId) {
        this.snackBar.open('No se encontró tu canal', 'Cerrar', { duration: 4000 });
        return;
      }

    if (this.streamForm.invalid) {
      this.snackBar.open('Completá el título', 'Cerrar', { duration: 4000 });
      return;
    }
    
    let formData = new FormData();
    formData.append('titulo', this.streamForm.value.titulo);
    formData.append('descripcion', this.streamForm.value.descripcion || '');

    if (this.selectedFile) {
      formData.append('miniatura', this.selectedFile, this.selectedFile.name);
    }

    this.uploading = true;
    this.uploadProgress = 0;


    this.streamService.crearTransmision(formData, this.canalId).subscribe({
      next: (res: any) => {
        this.uploading = false;

        if (res.stream === true) {
          const dialogRef = this.dialog.open(ModalConfirmacionStreamComponent, {
            data: { transmision: res.transmision }
          });

          dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) {
              this.streamService.eliminarStream(this.canalId).subscribe(() => {
                this.crearStream();
              });
            }
          });

        } else {
          const nuevaTransmision = res.transmision;
          this.snackBar.open('¡Stream creado con éxito!', 'Genial', { duration: 3000 });
          this.router.navigate(['/monitorear-stream', nuevaTransmision.id]);
        }
      },
      error: (err) => {
      this.uploading = false;
      console.error('Error al crear stream:', err);
      this.snackBar.open('Error al crear el stream', 'Cerrar', { duration: 5000 });
    }
    });
  }

  
}
