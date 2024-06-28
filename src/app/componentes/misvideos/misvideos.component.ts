import { Component, OnInit } from '@angular/core';
import { VideosService } from '../../servicios/videos.service';
import { AuthService } from '../../servicios/auth.service';
import { StatusService } from '../../servicios/status.service';
import { Canal } from '../../clases/canal';
import { CanalService } from '../../servicios/canal.service';



@Component({
  selector: 'app-misvideos',
  templateUrl: './misvideos.component.html',
  styleUrl: './misvideos.component.css'
})
export class MisvideosComponent implements OnInit{

  usuario:any;
  canal:any;
  canals = new Canal();
  canalId:any;
  canalNombre:any
  modalAbierto = false;


  videos:any;

  constructor(private videoService:VideosService, private authService: AuthService, public status:StatusService, private canalService: CanalService ){}

  ngOnInit() {
    this.obtenerUsuario();
    this.mostrarTodosLosVideos();
  }

  obtenerUsuario() {
    this.authService.usuario$.subscribe(user => {
      this.usuario = user;
      if (this.usuario) {
        this.obtenerCanal();
      }
    });
    this.authService.mostrarUserLogueado().subscribe();
  }

  abrirModal(event: Event): void {
    event.preventDefault();
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  obtenerCanal() {
    this.authService.obtenerCanalDelUsuario(this.usuario.id).subscribe((res: any) => {
      this.canal = res;
      if (res.canales && res.canales.length > 0) {
        this.canalId = res.canales[0].id;
        this.canalNombre = res.canales[0].nombre;
        this.mostrarTodosLosVideos();
      } else {
        console.error('El usuario no tiene canal hecho');
      }
    });
  }
  
  
  mostrarTodosLosVideos() {
    this.canalService.listarVideosDeCanal(this.canalId).subscribe(res => {
      this.videos = res;
    });
  }

}
