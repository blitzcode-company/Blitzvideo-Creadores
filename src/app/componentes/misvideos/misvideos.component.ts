import { Component, OnInit } from '@angular/core';
import { VideosService } from '../../servicios/videos.service';
import { AuthService } from '../../servicios/auth.service';
import { StatusService } from '../../servicios/status.service';
import { Canal } from '../../clases/canal';
import { CanalService } from '../../servicios/canal.service';
import { ModalEliminarVideoComponent } from '../modal-eliminar-video/modal-eliminar-video.component';
import { ModalAgregarPlaylistComponent } from '../modal-agregar-playlist/modal-agregar-playlist.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment.prod';
import { Title } from '@angular/platform-browser';
import { SidebarService } from '../../servicios/sidebar.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


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
  sidebarCollapsed$!: Observable<boolean>;

  videos: any[] = [];
  videosSeleccionados = new Set<number>();
  todosSeleccionados = false;

  constructor(private videoService:VideosService, 
    private authService: AuthService, 
    public status:StatusService, 
    private canalService: CanalService,
    public dialog: MatDialog,
    private title: Title,
    private sidebarService: SidebarService,
    private snackBar: MatSnackBar){
    this.title.setTitle("Mis videos - BlitzStudio");

    }

  ngOnInit() {
    this.sidebarCollapsed$ = this.sidebarService.sidebarCollapsed$;
    this.obtenerUsuario();
    this.mostrarTodosLosVideos();
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/video-default.png';
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
      width: '480px',
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
      if (res.canales) {
        this.canalId = res.canales.id;
        this.canalNombre = res.canales.nombre;
        this.mostrarTodosLosVideos();
      } else {
        console.error('El usuario no tiene canal hecho');
      }
    });
  }
  
  

  convertirDuracion(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    const segundosFormateados = segundosRestantes < 10 ? '0' + segundosRestantes : segundosRestantes;
    return `${minutos}:${segundosFormateados}`;
  }


  mostrarTodosLosVideos() {
  this.canalService.listarVideosDeCanal(this.canalId).subscribe(res => {
    this.videos = Array.isArray(res) ? res : [];
    this.videos.forEach(video => {
      if (video.duracion) {
        video.duracion = this.convertirDuracion(video.duracion);
      }
    });
  });
}

  toggleSeleccionVideo(videoId: number) {
    if (this.videosSeleccionados.has(videoId)) {
      this.videosSeleccionados.delete(videoId);
    } else {
      this.videosSeleccionados.add(videoId);
    }
    this.actualizarEstadoSeleccionTotal();
  }

  isVideoSeleccionado(videoId: number): boolean {
    return this.videosSeleccionados.has(videoId);
  }

  toggleSeleccionTodos() {
    this.todosSeleccionados = !this.todosSeleccionados;
    if (this.todosSeleccionados) {
      this.videos.forEach(video => this.videosSeleccionados.add(video.id));
    } else {
      this.videosSeleccionados.clear();
    }
  }

  actualizarEstadoSeleccionTotal() {
    this.todosSeleccionados = this.videos.length > 0 && 
                              this.videosSeleccionados.size === this.videos.length;
  }

  abrirModalPlaylists() {
    if (this.videosSeleccionados.size === 0) {
      this.snackBar.open('Selecciona al menos un video', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      return;
    }

    const dialogRef = this.dialog.open(ModalAgregarPlaylistComponent, {
      width: '550px',
      data: {
        videoIds: Array.from(this.videosSeleccionados)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.success) {
          this.videosSeleccionados.clear();
          this.todosSeleccionados = false;
        }

      }
    });
  }

  limpiarSeleccion() {
    this.videosSeleccionados.clear();
    this.todosSeleccionados = false;
  }

  eliminarVideosSeleccionados() {
    if (this.videosSeleccionados.size === 0) {
      this.snackBar.open('Selecciona al menos un video', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      return;
    }

    const dialogRef = this.dialog.open(ModalEliminarVideoComponent, {
      width: '480px',
      data: {
        multiple: true,
        count: this.videosSeleccionados.size
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const videoIds = Array.from(this.videosSeleccionados);
        this.videoService.eliminarMultiplesVideos(videoIds).subscribe(
          (res: any) => {
            if (res.success) {
              this.snackBar.open(res.message, 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });
              
              if (res.errores && res.errores.length > 0) {
                const mensajeErrores = `Algunos videos no pudieron eliminarse: ${res.errores.map((e: any) => e.video_id).join(', ')}`;
                this.snackBar.open(mensajeErrores, 'Cerrar', {
                  duration: 5000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom'
                });
              }
              
              this.videosSeleccionados.clear();
              this.todosSeleccionados = false;
              this.mostrarTodosLosVideos();
            }
          },
          (error) => {
            console.error('Error al eliminar videos', error);
            this.snackBar.open('Error al eliminar los videos', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          }
        );
      }
    });
  }

}
