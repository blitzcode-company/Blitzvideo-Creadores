import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VideosService } from '../../servicios/videos.service';
import { AuthService } from '../../servicios/auth.service';
import { Videos } from '../../clases/videos';
import { Canal } from '../../clases/canal';
import { FormBuilder } from '@angular/forms';
import { Etiqueta } from '../../clases/etiqueta';


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
  etiquetas: Etiqueta[] = [];
  etiquetasSeleccionadas: Etiqueta[] = []; 


  constructor(private videoService: VideosService, private authService: AuthService,private fb: FormBuilder) {
   }

  ngOnInit() {
    this.obtenerUsuario();
    this.obtenerCanal();
    this.listarEtiquetas()
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

  listarEtiquetas() {
    this.videoService.listarEtiquetas().subscribe(
      res => {
        this.etiquetas = res;
        this.videos.etiquetas = this.etiquetas;
        console.log(this.videos.etiquetas)
      },
      error => {
        console.error('Error al obtener las etiquetas:', error);
      }
    );
  }


  onEtiquetaSeleccionada(etiqueta: Etiqueta) {
    const index = this.etiquetasSeleccionadas.findIndex(e => e.id === etiqueta.id);
    if (index === -1) {
      this.etiquetasSeleccionadas.push(etiqueta);
    } else {
      this.etiquetasSeleccionadas.splice(index, 1);
    }
  }

  subirVideo() {
    if (this.videos.video && this.canalId && this.videos.titulo && this.videos.descripcion) {
      let formData = new FormData();
      formData.set('video', this.videos.video);
      formData.set('titulo', this.videos.titulo);
      formData.set('descripcion', this.videos.descripcion);

      this.etiquetasSeleccionadas.forEach((etiqueta, index) => {
        formData.append(`etiquetas[${index}]`, etiqueta.id.toString()); 
      });
      
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