import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VideosService } from '../../servicios/videos.service';
import { AuthService } from '../../servicios/auth.service';
import { Videos } from '../../clases/videos';
import { Canal } from '../../clases/canal';
import { FormBuilder } from '@angular/forms';
import { Etiqueta } from '../../clases/etiqueta';
import { Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment.prod';
import { Title } from '@angular/platform-browser';


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
  canalNombre : any;
  canalId:any;
  etiquetas: Etiqueta[][] = [];
  etiquetasSeleccionadas: Etiqueta[] = [];
  alerta: string[] = [];



  constructor(private videoService: VideosService, 
              private authService: AuthService,
              private fb: FormBuilder, 
              public router: Router,
              public location: Location,
              public title: Title) {
                this.title.setTitle("Subir video - BlitzStudio")
               }

  ngOnInit() {
    this.obtenerUsuario();
    this.listarEtiquetas()
  }

  serverIp = environment.serverIp

  

  obtenerUsuario() {
    this.authService.mostrarUserLogueado().subscribe((res) => {
      this.usuario = res;
      this.obtenerCanal();
    });
  }

  obtenerCanal() {
    this.authService.obtenerCanalDelUsuario(this.usuario.id).subscribe((res: any) => {
      this.canal = res;
      if (res.canales && res.canales.length > 0) {
        this.canalId = res.canales[0].id;
        this.canalNombre = res.canales[0].nombre      
      } else {
        console.error('El usuario no tiene canal hecho');
      }
    });
  }
  
  onVideoUpload(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.videos.video = input.files[0];
      console.log('Video file selected:', this.videos.video);
    } else {
      console.error('No video file selected');
    }
  }

  listarEtiquetas() {
    this.videoService.listarEtiquetas().subscribe(
      res => {
        this.etiquetas = this.formatearEtiquetas(res);
      },
      error => {
        console.error('Error al obtener las etiquetas:', error);
      }
    );
  }

  formatearEtiquetas(etiquetas: Etiqueta[]): Etiqueta[][] {
    const filas: Etiqueta[][] = [];
    const columnasPorFila = 1; 

    for (let i = 0; i < etiquetas.length; i += columnasPorFila) {
      filas.push(etiquetas.slice(i, i + columnasPorFila));
    }

    return filas;
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
      formData.append('video', this.videos.video);
      formData.append('titulo', this.videos.titulo);
      formData.append('descripcion', this.videos.descripcion);

      if (this.videos.miniatura) {
        formData.append('miniatura', this.videos.miniatura);
      }


      this.etiquetasSeleccionadas.forEach((etiqueta, index) => {
        formData.append(`etiquetas[${index}]`, etiqueta.id.toString());
      });

      this.videoService.subirVideo(this.canalId, formData).subscribe(
        res => {
          console.log('Video subido con éxito', res);
          this.alerta.push('Video subido con éxito');
          window.location.href = `${this.serverIp}3000/video/${res.id}`; 
        },
        error => {
          console.error('Error al subir el video', error);
          this.alerta.push('Error al subir el video');
        }
      );
    } else {
      this.alerta.push('Faltan datos requeridos para subir el video');
      console.error('Faltan datos requeridos para subir el video');
    }
  }


  onSubmit(form: NgForm) {
    if (form.valid && this.videos.video) {
      this.alerta.push('Formulario válido, enviando video...');
      console.log('Formulario válido, enviando video...');
      this.subirVideo();
    

    } else {
      this.alerta.push('Formulario no válido o archivo de video no seleccionado');
      console.error('Formulario no válido o archivo de video no seleccionado');
    }
  }

  onMiniaturaUpload(event: any) {
    this.videos.miniatura = event.target.files[0];
    if (this.videos.miniatura) {
      console.log('Miniatura file selected:', this.videos.miniatura);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const previewMiniatura = document.getElementById('previewMiniatura') as HTMLImageElement;
        if (previewMiniatura) {
          previewMiniatura.src = e.target.result;
        }
      }
      reader.readAsDataURL(this.videos.miniatura);
    } else {
      console.error('No miniatura file selected');
    }
  }

  previewImage(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const previewMiniatura = document.getElementById('previewMiniatura') as HTMLImageElement;
            if (previewMiniatura) {
                previewMiniatura.src = e.target.result;
            }
        }
        reader.readAsDataURL(input.files[0]);
    }
  }

}