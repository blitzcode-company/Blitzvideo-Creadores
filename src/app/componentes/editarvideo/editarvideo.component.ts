import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideosService } from '../../servicios/videos.service';
import { Videos } from '../../clases/videos';
import { environment } from '../../../environments/environment.prod';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../servicios/auth.service';
interface Etiqueta {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-editarvideo',
  templateUrl: './editarvideo.component.html',
  styleUrls: ['./editarvideo.component.css']
})
export class EditarvideoComponent implements OnInit {

  @ViewChild('videoInput') videoInput!: ElementRef;

  id: number;
  video: any = {};                 
  miniaturaPreview: string | null = null;
  miniaturaFile: File | null = null;
  nuevoVideoFile: File | null = null;

  etiquetas: Etiqueta[] = [];
  etiquetasSeleccionadas: number[] = [];
  guardando = false;
  alerta: { message: string; type: 'success' | 'error' }[] = [];

  serverIp = environment.serverIp;

  constructor(
    private route: ActivatedRoute,
    private api:AuthService, 
    private router: Router,
    private videoService: VideosService,
    private title: Title
  ) {
    this.title.setTitle('Editar video - BlitzStudio');
    this.id = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.cargarVideo();
    this.cargarEtiquetas();
  }

  // ==================== CARGAR DATOS ====================
  cargarVideo(): void {
    this.videoService.obtenerInformacionVideo( this.id).subscribe({
      next: (res: any) => {
        this.video = res;

        this.video.acceso = res.acceso || 'publico';

        if (res.etiquetas && Array.isArray(res.etiquetas)) {
        this.etiquetasSeleccionadas = res.etiquetas.map((e: any) => Number(e.id));
      } else {
        this.etiquetasSeleccionadas = [];
      }
        
      },

      
      error: (err) => {
        this.mostrarAlerta('Error al cargar el video', 'error');
        console.error(err);
      }
    });
  }

  cargarEtiquetas(): void {
    this.videoService.listarEtiquetas().subscribe({
      next: (res: any[]) => {
        this.etiquetas = res;
      },
      error: () => this.mostrarAlerta('Error al cargar etiquetas', 'error')
    });
  }

  triggerFileInput(): void {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    input?.click();
  }

  onMiniaturaChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.mostrarAlerta('Solo se permiten imágenes', 'error');
      return;
    }

    this.miniaturaFile = file;
    const reader = new FileReader();
    reader.onload = () => this.miniaturaPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  onVisibilidadChange(event: any): void {
  console.log('Visibilidad cambiada a:', event.value);
  this.video.acceso = event.value;
}
  onVideoChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      this.mostrarAlerta('Solo se permiten videos', 'error');
      return;
    }

    this.nuevoVideoFile = file;
    this.mostrarAlerta(`Video seleccionado: ${file.name}`, 'success');
  }


    onEtiquetaChange(event: any): void {
    const checkbox = event.source; 
    const id = +checkbox.value;

    if (checkbox.checked) {
      if (!this.etiquetasSeleccionadas.includes(id)) {
        this.etiquetasSeleccionadas.push(id);
      }
    } else {
      this.etiquetasSeleccionadas = this.etiquetasSeleccionadas.filter(x => x !== id);
    }
  }



  onSubmit(): void {
    if (!this.video.titulo?.trim()) {
      this.mostrarAlerta('El título es obligatorio', 'error');
      return;
    }

    this.guardando = true;
    this.alerta = [];

    const formData = new FormData();
    formData.append('titulo', this.video.titulo.trim());
    formData.append('descripcion', this.video.descripcion || '');
    formData.append('acceso', this.video.acceso); 
    if (this.miniaturaFile) {
      formData.append('miniatura', this.miniaturaFile);
    }

    if (this.nuevoVideoFile) {
      formData.append('video', this.nuevoVideoFile);
    }

    this.etiquetasSeleccionadas.forEach(id => {
      formData.append('etiquetas[]', id.toString());
    });

    this.videoService.editarVideo(this.id, formData).subscribe({
      next: (res: any) => {
        this.guardando = false;
        this.mostrarAlerta(
          `¡Video actualizado! <a href="${this.serverIp}3000/video/${this.id}" target="_blank">Ver video</a>`,
          'success'
        );
      },
      error: (err) => {
        this.guardando = false;
        console.error(err);
        this.mostrarAlerta('Error al guardar los cambios', 'error');
      }
    });
  }

  mostrarAlerta(message: string, type: 'success' | 'error'): void {
    this.alerta = [{ message, type }];
  }

  cerrarAlerta(a: any): void {
    this.alerta = this.alerta.filter(x => x !== a);
  }


  formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
}