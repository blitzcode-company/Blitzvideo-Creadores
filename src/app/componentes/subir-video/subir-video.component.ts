import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VideosService } from '../../servicios/videos.service';
import { AuthService } from '../../servicios/auth.service';
import { Videos } from '../../clases/videos';
import { Etiqueta } from '../../clases/etiqueta';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment.prod';
import { Title } from '@angular/platform-browser';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-subir-video',
  templateUrl: './subir-video.component.html',
  styleUrls: ['./subir-video.component.css']
})
export class SubirVideoComponent implements OnInit {
  
  videos = new Videos();
  usuario: any;
  canal: any;
  canalNombre: any;
  canalId: any;
  etiquetasSeleccionadas: Etiqueta[] = [];
  alerta: { message: string; type: 'success' | 'error' }[] = [];
  etiquetasPlanas: Etiqueta[] = [];

  videoPreview: string | null = null;
  thumbnailPreview: string | null = null;
  uploadProgress: number = 0;
  uploading: boolean = false;

  serverIp = environment.serverIp;

  constructor(
    private videoService: VideosService, 
    private authService: AuthService,
    public router: Router,
    public location: Location,
    public title: Title
  ) {
    this.title.setTitle("Subir video - BlitzStudio");
  }

  ngOnInit() {
    this.obtenerUsuario();
    this.listarEtiquetas();
  }

  obtenerUsuario() {
    this.authService.mostrarUserLogueado().subscribe((res) => {
      this.usuario = res;
      this.obtenerCanal();
    });
  }

  obtenerCanal() {
    this.authService.obtenerCanalDelUsuario(this.usuario.id).subscribe((res: any) => {
      this.canal = res;
      if (res.canales) {
        this.canalId = res.canales.id;
        this.canalNombre = res.canales.nombre;      
      } else {
        this.alerta.push({ message: 'El usuario no tiene canal creado', type: 'error' });
        this.router.navigate(['/crearCanal']);
      }
    });
  }

  onVideoUpload(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      this.videos.video = file;
      const reader = new FileReader();
      reader.onload = (e) => this.videoPreview = e.target?.result as string;
      reader.readAsDataURL(file);
      this.alerta = [];
    } else {
      this.alerta.push({ message: 'Video inválido o muy grande (max 100MB)', type: 'error' });
      event.target.value = '';
    }
  }

  onThumbnailUpload(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.videos.miniatura = file;
      const reader = new FileReader();
      reader.onload = (e) => this.thumbnailPreview = e.target?.result as string;
      reader.readAsDataURL(file);
    } else {
      this.alerta.push({ message: 'Solo imágenes permitidas', type: 'error' });
      event.target.value = '';
    }
  }

  listarEtiquetas() {
    this.videoService.listarEtiquetas().subscribe({
      next: (res) => this.etiquetasPlanas = res,
      error: (error) => {
        console.error('Error etiquetas:', error);
        this.alerta.push({ message: 'Error cargando etiquetas', type: 'error' });
      }
    });
  }

  onEtiquetaSeleccionada(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions);
    this.etiquetasSeleccionadas = selectedOptions.map(option => {
      const id = Number(option.value);
      return this.etiquetasPlanas.find(etiqueta => etiqueta.id === id);
    }).filter(Boolean) as Etiqueta[];
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.videos.video && this.canalId) {
      this.uploading = true;
      this.uploadProgress = 0;
      this.subirVideo();
    } else {
      this.alerta.push({ message: 'Completa todos los campos', type: 'error' });
    }
  }

  subirVideo() {
    const formData = new FormData();
    formData.append('video', this.videos.video!);
    formData.append('titulo', this.videos.titulo);
    formData.append('descripcion', this.videos.descripcion);
    
    if (this.videos.miniatura) formData.append('miniatura', this.videos.miniatura);
    
    const validas = this.etiquetasSeleccionadas.filter(e => e && e.id);
    validas.forEach((etiqueta, index) => {
      formData.append(`etiquetas[${index}]`, etiqueta.id.toString());
    });

    this.videoService.subirVideoConProgress(this.canalId, formData).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / (event.total || 1));
        } else if (event instanceof HttpResponse) {
          this.alerta.push({ message: '¡Video subido exitosamente!', type: 'success' });
          setTimeout(() => window.location.href = `${this.serverIp}3000/video/${event.body.id}`, 1500);
        }
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.alerta.push({ message: 'Error al subir video', type: 'error' });
        this.uploading = false;
        this.uploadProgress = 0;
      }
    });
  }
}