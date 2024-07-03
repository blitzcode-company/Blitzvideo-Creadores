import { Component } from '@angular/core';
import { CanalService } from '../../servicios/canal.service';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { NgForm } from '@angular/forms';
import { Canal } from '../../clases/canal';


@Component({
  selector: 'app-crear-canal',
  templateUrl: './crear-canal.component.html',
  styleUrl: './crear-canal.component.css'
})
export class CrearCanalComponent {
  constructor(private canalService: CanalService, 
              private authService: AuthService,
              private router:Router){}

usuario:any;
canal = new Canal();
imagenSeleccionada: File | null = null;
imagenUrl:any;

portada: File | undefined = undefined;



ngOnInit() {
  this.obtenerUsuario();
}

obtenerUsuario() {
  this.authService.mostrarUserLogueado().subscribe((res) => {
    this.usuario = res;
    console.log(res)

  });
}

onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.canal.portada = file;
  }
  console.log('Archivo seleccionado:', this.usuario.foto);
}

onFileSelected(event: any): void {
  if (event.target.files.length > 0) {
    this.portada = event.target.files[0];
  }
}

crearCanal() {
  const formData = new FormData();
  formData.append('portada', this.canal.portada || ''); 
  formData.append('nombre', this.canal.nombre); 
  formData.append('descripcion', this.canal.descripcion);

  this.canalService.crearCanal(this.usuario.id, formData).subscribe(() => {
    console.log('Canal creado correctamente');
    this.router.navigate(['/']);
  });
}



onSubmit(form: NgForm) {
  if (form.valid) {
    this.crearCanal();
    this.router.navigate(['/']);
  }
}

}
