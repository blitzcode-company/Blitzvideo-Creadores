import { Component, OnInit } from '@angular/core';
import { VideosService } from '../../servicios/videos.service';
import { AuthService } from '../../servicios/auth.service';
import { StatusService } from '../../servicios/status.service';
import { Canal } from '../../clases/canal';
import { CanalService } from '../../servicios/canal.service';
import { ModalEliminarVideoComponent } from '../modal-eliminar-video/modal-eliminar-video.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment.prod';
import { Title } from '@angular/platform-browser';


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
  serverIp = environment.serverIp

  videos: any[] = [];

  constructor(private videoService:VideosService, 
    private authService: AuthService, 
    public status:StatusService, 
    private canalService: CanalService,
    public dialog: MatDialog,
  private title: Title){
    this.title.setTitle("Mis videos - BlitzStudio");

    }

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

  eliminarVideo(idVideo: any) {
    const dialogRef = this.dialog.open(ModalEliminarVideoComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.videoService.eliminarVideo(idVideo)
          .subscribe(
            (res) => {
              console.log('Video eliminado correctamente');
              this.mostrarTodosLosVideos();
            },
            (error) => {
              console.error('Error al eliminar el video', error);
            }
          );
      }
    });
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
      this.videos = Array.isArray(res) ? res : [];
    });
  }

}
