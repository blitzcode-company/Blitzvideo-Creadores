import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StreamService } from '../../servicios/stream.service';
import { AuthService } from '../../servicios/auth.service';
import { ModalConfirmacionStreamComponent } from '../modal-confirmacion-stream/modal-confirmacion-stream.component';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


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

  ngOnInit() {
    this.obtenerUsuario();
  }

  constructor(
    private fb: FormBuilder,
    private streamService: StreamService,
    private dialog: MatDialog,
    private authService: AuthService,
    private snackBar: MatSnackBar,

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
    this.selectedFile = event.target.files[0];
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
      console.error('No se ha encontrado el canal del usuario');
      return;
    }
    
    let formData = new FormData();
    formData.append('titulo', this.streamForm.value.titulo);
    formData.append('descripcion', this.streamForm.value.descripcion || '');
    if (this.selectedFile) {
      formData.append('miniatura', this.selectedFile);
    }

    this.streamService.crearTransmision(formData, this.canalId).subscribe({
      next: (res: any) => {
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
          this.router.navigate(['/monitorear-stream', nuevaTransmision.id]); 
        }
      },
      error: err => {
        console.error(err);

      }
    });
  }

}
