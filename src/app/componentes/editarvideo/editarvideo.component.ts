import { Component } from '@angular/core';
import { VideosService } from '../../servicios/videos.service';
import { Videos } from '../../clases/videos';
import { NgForm } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editarvideo',
  templateUrl: './editarvideo.component.html',
  styleUrl: './editarvideo.component.css'
})
export class EditarvideoComponent {
  id: any;
  videos = new Videos();
  video: any;
  alerta: string[] = [];


  constructor(private route:ActivatedRoute, private videoService: VideosService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']
    this.mostrarVideo();
  }


  mostrarVideo() {
    this.videoService.obtenerInformacionVideo(this.id).subscribe(res => {
      this.videos = res;
      this.video = this.videos;

      console.log(this.video);
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

  editarVideo(): void {
    const formData = new FormData();
    if (this.videos.video) {
      formData.append('video', this.videos.video);
    } else {
      console.error('El archivo de video es undefined');
      this.alerta.push('El archivo de video es undefined');
    }

    formData.append('titulo', this.videos.titulo);
    formData.append('descripcion', this.videos.descripcion);

    this.videoService.editarVideo(this.videos.id, formData).subscribe(
      res => {
        console.log('Video actualizado correctamente', res);
        this.alerta.push('Video actualizado correctamente');
      },
      error => {
        console.error('Error al actualizar el video', error);
        this.alerta.push('Error al actualizar el video');
      }
    );
  }



  onSubmit(dataform: any) {
    if (this.videos.video) {
      this.alerta.push('Formulario válido, editando video...');
      console.log('Formulario válido, editando video...', dataform);
      this.editarVideo();
    

    } else {
      this.alerta.push('Formulario no válido o archivo de video no seleccionado');
      console.error('Formulario no válido o archivo de video no seleccionado');
    }
  
  }
  

}
