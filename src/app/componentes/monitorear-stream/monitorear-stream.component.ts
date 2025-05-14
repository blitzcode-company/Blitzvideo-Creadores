import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StreamService } from '../../servicios/stream.service';
import { AuthService } from '../../servicios/auth.service';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import Hls from 'hls.js';



@Component({
  selector: 'app-monitorear-stream',
  templateUrl: './monitorear-stream.component.html',
  styleUrl: './monitorear-stream.component.css'
})
export class MonitorearStreamComponent implements OnInit,  AfterViewInit  {

  transmisionId: string = '';
  stream: any = null;
  cargando: boolean = true;
  canalId: any;
  canalNombre: any;
  usuario: any;
  canal: any;
  streamUrl: any;
  @ViewChild('videoPlayer') videoRef!: ElementRef;


  constructor(
    private route: ActivatedRoute,
    private streamService: StreamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.transmisionId = this.route.snapshot.paramMap.get('id') || '';
    this.obtenerUsuario(); 
  }

  ngAfterViewInit(): void {
    this.reproducirStream();
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

  obtenerCanal() {
    this.authService.obtenerCanalDelUsuario(this.usuario.id).subscribe((res: any) => {
      this.canal = res;
      if (res.canales) {
        this.canalId = res.canales.id;
        this.canalNombre = res.canales.nombre;

        this.obtenerCanalYStream();
      } else {
        console.error('El usuario no tiene canal hecho');
        this.cargando = false;
      }
    });
  }

  obtenerCanalYStream() {
    this.streamService.obtenerDatosTransmision(this.transmisionId).subscribe({
      next: (res: any) => {
        this.stream = res.transmision;
        this.streamUrl = res.url_hls;
        this.cargando = false;

        setTimeout(() => this.reproducirStream(), 0);
      },
      error: err => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  reproducirStream(): void {
    if (!this.videoRef || !this.videoRef.nativeElement) return;

    const video: HTMLVideoElement = this.videoRef.nativeElement;

    if (this.stream?.activo === 1 && this.streamUrl) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(this.streamUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = this.streamUrl;
      }
    }
  }
}
