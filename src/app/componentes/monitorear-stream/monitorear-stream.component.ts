import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StreamService } from '../../servicios/stream.service';
import { AuthService } from '../../servicios/auth.service';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import Hls from 'hls.js';
import { ChatstreamService } from '../../servicios/chatstream.service';



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
  userId:any;
  canal: any;
  streamUrl: any;
  chatMessagesList: any[] = [];
  mensaje: string = '';
  private chatSubscription: Subscription | null = null;
  private subscription: Subscription | null = null;
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  @ViewChild('videoPlayer') videoRef!: ElementRef;

  mensajes: any[] = [];


  constructor(
    private route: ActivatedRoute,
    private streamService: StreamService,
    private chatService: ChatstreamService,
    private authService: AuthService,
    public title: Title
  ) {

    this.title.setTitle("Monitoreo de Stream - BlitzStudio");


  }

  ngOnInit(): void {
    this.transmisionId = this.route.snapshot.paramMap.get('id') || '';
    this.obtenerUsuario(); 
    this.loadChatMessagesAndListen();

    this.chatService.cargarMensaje(this.transmisionId).subscribe((res) => {
      this.mensajes = res;
    });

    this.subscription = this.chatService.startListening(this.transmisionId).subscribe((nuevo) => {
      this.mensajes.push(nuevo);
    });
  }

  ngAfterViewInit(): void {
    this.reproducirStream();
  }

  enviarMensaje() {
    if (!this.mensaje?.trim()) return;
  
    this.chatService.mandarMensaje(this.transmisionId, this.mensaje.trim(), this.userId)
      .subscribe({
        next: (nuevoMsg: any) => {
          this.chatMessagesList.push({
            id: nuevoMsg.id,
            user: nuevoMsg.user.name,
            user_photo: nuevoMsg.user.foto,
            text: nuevoMsg.mensaje,
            created_at: nuevoMsg.created_at,
            userId: this.userId
          });
          this.mensaje = '';
          this.scrollToBottom();
        },
        error: (err) => console.error('Error al enviar mensaje:', err)
      });
  }




  loadChatMessagesAndListen() {
    if (!this.transmisionId) return;
  
    this.chatService.cargarMensaje(this.transmisionId).subscribe({
      next: (messages: any) => {
        this.chatMessagesList = messages.map((msg: any) => ({
          id: msg.id,
          user: msg.user.name,
          user_photo: msg.user.foto,
          text: msg.mensaje,
          created_at: msg.created_at,
        }));
        this.scrollToBottom();
      },
      error: (err) => console.error('Error al cargar mensajes:', err)
    });
  
    if (this.chatSubscription) this.chatSubscription.unsubscribe();
  
    this.chatSubscription = this.chatService.startListening(this.transmisionId)
      .subscribe({
        next: (message) => {
          this.chatMessagesList.push({
            id: message.id,
            user: message.user.name,
            user_photo: message.user.foto,
            text: message.mensaje,
            created_at: message.created_at,
          });
          this.scrollToBottom();
        },
        error: (err) => console.error('Error al recibir mensaje:', err)
      });
  }
  
  sendChatMessage() {
    if (!this.mensaje?.trim() || !this.transmisionId) return;
  
    this.chatService.mandarMensaje(this.transmisionId, this.mensaje.trim(), this.userId)
      .subscribe({
        next: () => this.mensaje = '',
        error: (err) => console.error('Error al enviar mensaje:', err)
      });
  }
  
  scrollToBottom() {
    setTimeout(() => {
      if (this.chatMessages?.nativeElement) {
        const container = this.chatMessages.nativeElement;
        container.scroll({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }, 50);
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/user.png';
  }


  obtenerUsuario() {
    this.authService.usuario$.subscribe(user => {
      this.usuario = user;
      this.userId = this.usuario.id;

      this.sendChatMessage();

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
