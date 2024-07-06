import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideosService } from '../../servicios/videos.service';
import { Videos } from '../../clases/videos';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-editarvideo',
  templateUrl: './editarvideo.component.html',
  styleUrls: ['./editarvideo.component.css']
})
export class EditarvideoComponent implements OnInit {
  id: any;
  videos = new Videos();
  video: any;
  alerta: string[] = [];
  miniaturaFile: File | null = null;
  videoFile: File | null = null;
  etiquetas: any[] = [];
  etiquetasSeleccionadas: number[] = [];  
  serverIp = environment.serverIp 
  constructor(
    private route: ActivatedRoute,
    private videoService: VideosService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.mostrarVideo();
    this.cargarEtiquetas();
  }

  mostrarVideo(): void {
    this.videoService.obtenerInformacionVideo(this.id).subscribe(res => {
      this.videos = res;
      this.video = this.videos;

      // Actualizar etiquetas seleccionadas
      this.etiquetasSeleccionadas = this.videos.etiquetas.map((etiqueta: any) => etiqueta.id);
    });
  }

  cargarEtiquetas(): void {
    this.videoService.listarEtiquetas().subscribe(
      (res: any) => {
        this.etiquetas = res;
      },
      error => {
        console.error('Error al cargar las etiquetas:', error);
      }
    );
  }

  onVideoUpload(event: any): void {
    this.videoFile = event.target.files[0];
    if (this.videoFile) {
      console.log('Video file selected:', this.videoFile);
    } else {
      console.error('No video file selected');
    }
  }

  previewImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.miniaturaFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const previewMiniatura = document.getElementById('previewMiniatura') as HTMLImageElement;
        if (previewMiniatura) {
          previewMiniatura.src = reader.result as string;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onEtiquetaChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.etiquetasSeleccionadas.push(+checkbox.value);
    } else {
      this.etiquetasSeleccionadas = this.etiquetasSeleccionadas.filter(id => id !== +checkbox.value);
    }
  }

  editarVideo(): void {
    const formData = new FormData();
    if (this.videoFile) {
      formData.append('video', this.videoFile);
    }
    if (this.miniaturaFile) {
      formData.append('miniatura', this.miniaturaFile);
    }

    formData.append('titulo', this.videos.titulo);
    formData.append('descripcion', this.videos.descripcion);
    this.etiquetasSeleccionadas.forEach(id => {
      formData.append('etiquetas[]', id.toString());
    });

    this.videoService.editarVideo(this.videos.id, formData).subscribe(
      res => {
        console.log('Video actualizado correctamente');
        this.alerta.push('Video actualizado correctamente');
        window.location.href = `${this.serverIp}3000/video/${this.videos.id}`; 
      },
      error => {
        console.error('Error al actualizar el video', error);
        this.alerta.push('Error al actualizar el video');
      }
    );
  }

  onSubmit(dataform: any): void {
    if (dataform.valid) {
      this.editarVideo();
    } else {
      this.alerta.push('Formulario no válido');
      console.error('Formulario no válido');
    }
  }
}
