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


ngOnInit() {
  this.obtenerUsuario();
}

obtenerUsuario() {
  this.authService.mostrarUserLogueado().subscribe((res) => {
    this.usuario = res;
    console.log(res)

  });
}

crearCanal() {
  this.canalService.crearCanal(this.usuario.id, this.canal).subscribe(() => {
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
