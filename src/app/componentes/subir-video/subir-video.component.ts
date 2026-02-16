import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
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
import { SidebarService } from '../../servicios/sidebar.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-subir-video',
  templateUrl: './subir-video.component.html',
  styleUrls: ['./subir-video.component.css']
})
export class SubirVideoComponent implements OnInit {
  
  usuario: any;
  canal: any;
  canalNombre: any;
  canalId: any;
  etiquetasSeleccionadas: Etiqueta[] = [];
  alerta: { message: string; type: 'success' | 'error' }[] = [];
  etiquetasPlanas: Etiqueta[] = [];
  sidebarCollapsed$!: Observable<boolean>;

  titulo: string = '';
  descripcion: string = '';
  videoFile: File | null = null;
  thumbnailFile: File | null = null;


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
    public title: Title,
    private sidebarService: SidebarService
  ) {
    this.title.setTitle("Subir video - BlitzStudio");
  }

  ngOnInit() {
    this.sidebarCollapsed$ = this.sidebarService.sidebarCollapsed$;
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

@Output() fileDropped = new EventEmitter<File>();

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event']) onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    const file = evt.dataTransfer?.files[0];
    if (file) this.fileDropped.emit(file);
  }

onVideoUpload(event: any) {
    const file: File = event.target?.files?.[0] || event;
    if (!file || !file.type.startsWith('video/')) {
      this.alerta.push({ message: 'Por favor selecciona un archivo de video válido', type: 'error' });
      return;
    }

    this.videoFile = file;
    const reader = new FileReader();
    reader.onload = () => this.videoPreview = reader.result as string;
    reader.readAsDataURL(file);
    this.alerta = [];
  }
formatBytes(bytes: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  removeVideo() {
    this.videoFile = this.videoPreview = null;
    this.thumbnailFile = this.thumbnailPreview = null;
    this.titulo = this.descripcion = '';
    this.etiquetasSeleccionadas = [];
  }

onThumbnailUpload(event: any) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      this.alerta.push({ message: 'Selecciona una imagen válida', type: 'error' });
      return;
    }

    this.thumbnailFile = file;
    const reader = new FileReader();
    reader.onload = () => this.thumbnailPreview = reader.result as string;
    reader.readAsDataURL(file);
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
    if (!form.valid || !this.videoFile || !this.canalId) {
      this.alerta.push({ message: 'Completa el título y selecciona un video', type: 'error' });
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('video', this.videoFile, this.videoFile.name);
    formData.append('titulo', this.titulo.trim());
    formData.append('descripcion', this.descripcion.trim());

    // Miniatura opcional
    if (this.thumbnailFile) {
      formData.append('miniatura', this.thumbnailFile, this.thumbnailFile.name);
    }

    // Etiquetas → solo IDs (tu backend espera etiquetas[] o etiquetas[0], etc.)
    this.etiquetasSeleccionadas.forEach((id, i) => {
      formData.append(`etiquetas[${i}]`, id.toString());
      // o si tu backend espera etiquetas[] → formData.append('etiquetas[]', id.toString());
    });

    this.videoService.subirVideoConProgress(this.canalId, formData).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / (event.total || 1));
        } else if (event instanceof HttpResponse) {
          this.alerta = [];
          this.alerta.push({ message: '¡Video subido con éxito!', type: 'success' });
          setTimeout(() => {
            window.location.href = `${this.serverIp}3000/video/${event.body.id}`;
          }, 1500);
        }
      },
      error: (err) => {
        console.error('Error subida:', err);
        this.alerta.push({ message: 'Error al subir el video', type: 'error' });
        this.uploading = false;
        this.uploadProgress = 0;
      }
    });
  }
 

  cerrarAlerta(alerta: any) {
  this.alerta = this.alerta.filter(a => a !== alerta);
}
}