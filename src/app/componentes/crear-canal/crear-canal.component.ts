import { Component } from '@angular/core';
import { CanalService } from '../../servicios/canal.service';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { NgForm } from '@angular/forms';
import { Canal } from '../../clases/canal';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-crear-canal',
  templateUrl: './crear-canal.component.html',
  styleUrl: './crear-canal.component.css'
})
export class CrearCanalComponent {
  constructor(private canalService: CanalService, 
              private authService: AuthService,
              private router:Router,
              private title: Title){
                this.title.setTitle("Crear canal - BlitzStudio");



              }

usuario:any;
canal = new Canal();
imagenSeleccionada: File | null = null;
imagenUrl:any;

portada: File | undefined = undefined;
alerta: { message: string; type: 'success' | 'error' }[] = [];
uploadProgress: number = 0;
uploading: boolean = false;


ngOnInit() {
  this.obtenerUsuario();
}

obtenerUsuario() {
  this.authService.mostrarUserLogueado().subscribe((res) => {
    this.usuario = res;
    console.log(res)

  });
}


onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    this.canal.portada = file;
    const reader = new FileReader();
    reader.onload = (e) => this.canal.portadaPreview = e.target?.result as string;
    reader.readAsDataURL(file);
  }
}

crearCanal(): void {
  if (!this.canal.nombre || !this.canal.descripcion || !this.canal.portada) {
    console.error('Nombre, Descripción o Portada faltan.');
    return;
  }

  const formData = new FormData();
  formData.append('nombre', this.canal.nombre); 
  formData.append('descripcion', this.canal.descripcion);
  formData.append('portada', this.canal.portada);

  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });


  

  this.canalService.crearCanal(this.usuario.id, formData).subscribe({
    next: () => {
      console.log('Canal creado correctamente');
      this.router.navigate(['/misVideos']);
    },
    error: (err) => {
      console.error('Error al crear el canal', err);
    }
  });
}

onSubmit(form: NgForm) {
  if (form.valid) {
    this.crearCanal();
  }
}

}
