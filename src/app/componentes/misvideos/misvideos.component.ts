import { Component, OnInit } from '@angular/core';
import { VideosService } from '../../servicios/videos.service';
import { AuthService } from '../../servicios/auth.service';
import { StatusService } from '../../servicios/status.service';
import { Canal } from '../../clases/canal';
import { CanalService } from '../../servicios/canal.service';
import { ModalEliminarVideoComponent } from '../modal-eliminar-video/modal-eliminar-video.component';
import { MatDialog } from '@angular/material/dialog';


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


  videos:any;

  constructor(private videoService:VideosService, 
    private authService: AuthService, 
    public status:StatusService, 
    private canalService: CanalService,
    public dialog: MatDialog){

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
      if (result) { // Si el usuario hace clic en Aceptar
        this.videoService.eliminarVideo(idVideo)
          .subscribe(
            (data) => {
              console.log('Video eliminado correctamente', data);
              // Aquí podrías añadir lógica adicional después de eliminar el video
            },
            (error) => {
              console.error('Error al eliminar el video', error);
              // Aquí manejas el error, mostrando un mensaje al usuario o realizando alguna acción específica
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
      this.videos = res;
    });
  }

}
