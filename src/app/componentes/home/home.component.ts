import { Component, OnInit } from '@angular/core';
import { VideosService } from '../../servicios/videos.service';
import { StatusService } from '../../servicios/status.service';
import { AuthService } from '../../servicios/auth.service';
import { Canal } from '../../clases/canal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  usuario:any;
  canal:any;
  canals = new Canal();
  canalId:any;
  canalNombre:any



  constructor(private videoService:VideosService, private api: AuthService, public status:StatusService ){}

  ngOnInit() {
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    this.api.usuario$.subscribe(user => {
      this.usuario = user;
      if (this.usuario) {
        this.obtenerCanal();
      }
    });
    this.api.mostrarUserLogueado().subscribe();
  }



  obtenerCanal() {
    this.api.obtenerCanalDelUsuario(this.usuario.id).subscribe((res: any) => {
      this.canal = res;
      if (res.canales && res.canales.length > 0) {
        this.canalId = res.canales[0].id;
        this.canalNombre = res.canales[0].nombre;
        console.log(res.canales[0].id);
      } else {
        console.error('El usuario no tiene canal hecho');
      }
    });
  }


}
