import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VideosService } from '../../servicios/videos.service';
import { AuthService } from '../../servicios/auth.service';
import { Videos } from '../../clases/videos';
import { Canal } from '../../clases/canal';


@Component({
  selector: 'app-subir-video',
  templateUrl: './subir-video.component.html',
  styleUrl: './subir-video.component.css'
})
export class SubirVideoComponent implements OnInit{
  
  videos = new Videos();
  usuario: any;
  canal:any;
  canals = new Canal();
  canalId:any;


  constructor(private videoService: VideosService, private authService: AuthService) { }

  ngOnInit() {
    this.obtenerUsuario();
    this.obtenerCanal();
  }

  

  obtenerUsuario() {
    this.authService.mostrarUserLogueado().subscribe((res) => {
      this.usuario = res;
      console.log(res);
      this.obtenerCanal();
    });
  }

  obtenerCanal() {
    this.authService.obtenerCanalDelUsuario(this.usuario.id).subscribe((res: any) => {
      this.canal = res;
      if (res.canales && res.canales.length > 0) {
        this.canalId = res.canales[0].id;
        console.log(this.canalId);
      
      } else {
        console.error('El usuario no tiene canal hecho');
      }
    });
  }
  
  onVideoUpload(event: any) {
    this.videos.video = event.target.files[0];
    if (this.videos.video) {
      console.log('Video file selected:', this.videos.video);
    } else {
      console.error('No video file selected');
    }  
  }

  subirVideo() {
    if (this.videos.video && this.canalId && this.videos.titulo && this.videos.descripcion) {
      let formData = new FormData();
      formData.set('video', this.videos.video);
      formData.set('titulo', this.videos.titulo);
      formData.set('descripcion', this.videos.descripcion);

      this.videoService.subirVideo(this.canalId, formData).subscribe(
        res => {
          console.log('Video subido con éxito', res);
        },
        error => {
          console.error('Error al subir el video', error);
        }
      );
    } else {
      console.error('Faltan datos requeridos para subir el video');
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.videos.video) {
      console.log('Formulario válido, enviando video...');
      this.subirVideo();
    } else {
      console.error('Formulario no válido o archivo de video no seleccionado');
    }
  }
}