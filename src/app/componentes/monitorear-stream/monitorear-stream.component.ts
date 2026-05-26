import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StreamService } from '../../servicios/stream.service';
import { AuthService } from '../../servicios/auth.service';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import videojs from 'video.js';
import { ChatstreamService, ChatMessage } from '../../servicios/chatstream.service';
import { Streams } from '../../clases/stream';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { CookieService } from 'ngx-cookie-service';
import { ChangeDetectorRef } from '@angular/core';
import {  Subject, takeUntil } from 'rxjs';
import { SidebarService } from '../../servicios/sidebar.service';
import { environment } from '../../../environments/environment.prod';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarDialogoComponent } from '../confirmar-dialogo/confirmar-dialogo.component';

@Component({
  selector: 'app-monitorear-stream',
  templateUrl: './monitorear-stream.component.html',
  styleUrl: './monitorear-stream.component.css'
})
export class MonitorearStreamComponent implements OnInit,  AfterViewInit  {

  player!: any
  private playerInitialized = false;
  transmisionId: number = 0;
  stream = new Streams();
  cargando: boolean = true;
  canalId: any;
  canalNombre: any;
  usuario: any;
  userId:any;
  canal: any;
  streamUrl: any;
  chatMessagesList: any[] = [];
  mensajes: any[] = [];
  streamKey:any;
  mensaje: string = '';
  metrics: any = null;
  activandoStream = false;
  mostrandoClave = false;
  metricsPolling$: Subscription | null = null;
  cargandoClave: any;
  isReallyLive = false
  private chatSubscription: Subscription | null = null;
  private subscription: Subscription | null = null;
  playerHasStarted = false;
  sidebarCollapsed$!: Observable<boolean>;
  cerrarGuiaAutomaticamente = false;
  isClosing = false;        
  
  private destroy$ = new Subject<void>();
  private isUserAtBottom = true;
  private chatContainer!: ElementRef<HTMLDivElement>;
  private videoPlayerNative!: HTMLVideoElement;


  viewers = 0;
  messages: ChatMessage[] = [];



  @ViewChild('chatMessages') chatMessages!: ElementRef;
  @ViewChild('videoPlayer') videoRef!: ElementRef;
  @ViewChild('videoPlayer', { static: false }) set videoPlayerElement(element: ElementRef<HTMLVideoElement>) {
    if (element && !this.playerInitialized) {
      this.videoPlayerNative = element.nativeElement;
      this.inicializarVideoJS();
    }
  }



 constructor(
  private route: ActivatedRoute,
  private router: Router,
  private streamService: StreamService,
  private chatService: ChatstreamService,
  private authService: AuthService,
  private sidebarService: SidebarService,
  private cookie: CookieService,
  private cdr: ChangeDetectorRef,
  private snackBar: MatSnackBar,
  public title: Title,
  private dialog: MatDialog
) {
  this.title.setTitle("Monitoreo de Stream - BlitzStudio");

  const token = this.cookie.get('accessToken');

  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'blitzvideo-key',
    wsHost: '172.18.0.17',
    wsPort: 6001,
    wssPort: 6001,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws'],
    cluster: 'mt1',
    authEndpoint: 'http://172.18.0.2:8000/broadcasting/auth',
    auth: {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      }
    }
  });

  console.log('Laravel Echo inicializado correctamente');
}

ngOnInit(): void {
  this.transmisionId = Number(this.route.snapshot.paramMap.get('id')) || 0;
  this.sidebarCollapsed$ = this.sidebarService.sidebarCollapsed$;
  this.obtenerUsuario(); 
  this.cargarMensajesIniciales();
  this.suscribirseAMensajesEnTiempoReal();
  this.cargarStreamYMetrics();
  this.cargarViewers();
  this.cargarStreamKeyDelCanal();
  this.iniciarEscuchaViewersEnTiempoReal(); 
  const guideClosed = localStorage.getItem('streamGuideClosed');
    if (guideClosed === 'true') {
      this.cerrarGuiaAutomaticamente = true;
    }

  this.subscription = this.chatService.startListening(this.transmisionId).subscribe((nuevo) => {
    this.mensajes.push(nuevo);
  });
}
  ngAfterViewInit(): void {
    this.setupScrollListener();
  }


private iniciarEscuchaViewersEnTiempoReal() {
  if (!this.transmisionId) return;

  window.Echo.channel(`stream.${this.transmisionId}`)
    .listen('.stream-event', (e: any) => {
      if (e.count !== undefined) {
        this.stream.viewers = e.count;
        this.animarViewers(e.count);
      }
    })
    .listen('.stream.status.changed', (data: any) => {
      console.log('Estado del stream cambió:', data.estado);
      this.stream.video.estado = data.estado;
    console.log('Suscrito al canal stream.' + this.transmisionId);

      if (data.estado === 'DIRECTO') {
        this.stream.activo = true;
        this.isReallyLive = false;
        if (this.streamKey && !this.metricsPolling$) {
          this.iniciarMetricsPolling(this.streamKey);
        }
      } else if (data.estado === 'FINALIZADO') {
        this.stream.activo = false;
        this.isReallyLive = false;
        this.playerHasStarted = false;
        this.metricsPolling$?.unsubscribe();
        this.metricsPolling$ = null;
        this.player?.src(null);
      }

      this.cdr.markForCheck();
    });
}


private animarViewers(nuevoNumero: number) {
  const elemento = document.querySelector('.viewers-count strong');
  if (!elemento) return;

  elemento.classList.remove('pulse-up', 'pulse-down');
  
  const anterior = this.stream.viewers || 0;
  const clase = nuevoNumero > anterior ? 'pulse-up' : 'pulse-down';

  elemento.classList.add(clase);
  setTimeout(() => elemento.classList.remove(clase), 800);
}


  inicializarVideoJS() {
  if (this.playerInitialized || !this.videoPlayerNative) return;

  console.log('Inicializando Video.js...');
  this.player = videojs(this.videoPlayerNative, {
    html5: {
      vhs: {
        overrideNative: true,
        enableLowInitialPlaylist: true,
        fastQualityChange: true,
        smoothQualityChange: true
      }
    },
    liveui: true,
    responsive: true,
    fluid: true,
    autoplay: true,
    muted: true,
    controls: true,
    preload: 'auto',
    liveTracker: true
  }, () => {
    console.log('Video.js inicializado correctamente');
    this.playerInitialized = true;

    if (this.stream?.activo && this.streamUrl) {
      this.actualizarVideoSource();
    }
  });

  this.player.on('playing', () => {
    this.playerHasStarted = true;
    this.player.addClass('vjs-has-started');
    this.player.addClass('vjs-playing'); 
    console.log('EN VIVO - Señal recibida de OBS');
  });

  this.player.on('pause', () => {
    if (!this.player.ended()) {
      this.playerHasStarted = false;
    }
  });
  this.player.on('waiting', () => {
    if (this.playerHasStarted) console.log('Buffering...');
  });

  this.player.on('error', (e: any) => {
    console.error('Error en Video.js:', this.player.error());
  });
}

cargarHLS() {
  if (!this.player || !this.streamUrl || !this.stream?.activo) return;

  console.log('Cargando HLS:', this.streamUrl);
  this.player.src({
    src: this.streamUrl,
    type: 'application/x-mpegURL'
  });

  this.player.ready(() => {
    this.player.play().catch(() => {
      console.log('Autoplay bloqueado (normal)');
    });
  });
}

   enviarMensaje(): void {
    if (!this.mensaje.trim() || !this.transmisionId || !this.userId) return;

    const texto = this.mensaje.trim();

    const tempId = -Date.now();
    const mensajeOptimista: ChatMessage = {
      id: tempId,
      user: this.usuario.name || 'Tú',
      user_photo: this.usuario.foto || null,
      text: texto,
      created_at: new Date().toISOString()
    };

    this.messages.push(mensajeOptimista);
    this.scrollToBottom();
    this.cdr.markForCheck();

    this.mensaje = '';

    this.chatService.mandarMensaje(this.transmisionId, texto, this.userId).subscribe({
      next: () => {
        console.log('Mensaje enviado correctamente');
      },
      error: (err) => {
        console.error('Error enviando mensaje:', err);
        this.messages = this.messages.filter(m => m.id !== tempId);
        this.cdr.markForCheck();
      }
    });
  }



cargarStreamYMetrics() {
  this.streamService.obtenerDatosTransmision(this.transmisionId).subscribe({
    next: (res: any) => {
      this.stream = res;
            console.log('Datos del stream:', this.stream );

      this.streamUrl = res.url_hls;
      this.canalId = res.canal.id; 

     if (!this.canalId) {
        console.error('No se pudo obtener el ID del canal');
        this.cargando = false;
        return;
      }

      this.cargarStreamKeyDelCanal();
      this.actualizarVideoSource(); 
      this.cargando = false;
    }
  });
}

cargarViewers() {
  if (!this.transmisionId) return;
  this.streamService.obtenerViewers(this.transmisionId)
    .subscribe({
      next: (res: any) => {
        this.viewers = res.viewers;
      },
      error: (err) => console.error('Error al obtener viewers:', err)
    });
}

cargarStreamKeyDelCanal() {
  if (!this.canalId || !this.userId || this.streamKey) return;
  this.cargandoClave = true;
  this.streamService.obtenerInformacionRTMP(this.canalId, this.userId)
    .subscribe({
      next: (res) => {
        console.log(res)
        this.streamKey = res.stream_key;
        this.cargandoClave = false;
        if (this.streamKey && this.stream?.activo) {
          this.iniciarMetricsPolling(this.streamKey);
        }
      },
      error: (err) => {
        console.error('Error al obtener stream_key del canal:', err);
        this.cargandoClave = false;
      }
    });
  }

iniciarMetricsPolling(streamKey: string) {
  if (this.metricsPolling$) {
    this.metricsPolling$.unsubscribe();
  }

  this.metricsPolling$ = this.streamService.startMetricsPolling(streamKey, 4000)
    .subscribe(metrics => {
      this.metrics = metrics;
      const estaVivo = metrics.online && metrics.segments > 0;

      if (estaVivo && !this.isReallyLive) {
        this.isReallyLive = true;

        if (!this.streamUrl) {
          this.streamService.obtenerDatosTransmision(this.transmisionId).subscribe({
            next: (res: any) => {
              this.streamUrl = res.url_hls;
              console.log('URL obtenida:', this.streamUrl);
              this.actualizarVideoSource();
            }
          });
        } else {
          this.actualizarVideoSource();
        }

      } else if (!estaVivo) {
        this.isReallyLive = false;
      }
    });
}

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
    if (this.metricsPolling$) this.metricsPolling$.unsubscribe();
    if (this.subscription) this.subscription.unsubscribe();
    if (this.chatSubscription) this.chatSubscription.unsubscribe();
  }

  private cargarMensajesIniciales(): void {
    this.chatService.cargarMensaje(this.transmisionId).subscribe({
      next: (res: any) => {
        this.messages = res.map((msg: any) => ({
          id: msg.id,
          user: msg.user?.name || 'Anónimo',
          user_photo: msg.user?.foto || null,
          text: msg.mensaje || '',
          created_at: msg.created_at
        }));

        this.scrollToBottom();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error cargando mensajes:', err)
    });
  }

  private suscribirseAMensajesEnTiempoReal(): void {
    this.chatService.startListening(this.transmisionId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (msg) => {
        const indexOptimista = this.messages.findIndex(m => 
          m.id < 0 && 
          m.text === msg.text && 
          m.user === msg.user
        );
        
        if (indexOptimista !== -1) {
          this.messages[indexOptimista] = msg;
        } else {
          const yaExiste = this.messages.some(m => m.id === msg.id && m.id > 0);
          
          if (!yaExiste) {
            this.messages.push(msg);
          }
        }
        
        this.limitarMensajes();
        if (this.isUserAtBottom) this.scrollToBottom();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error en WebSocket:', err)
    });
  }

  private setupScrollListener(): void {
    if (!this.chatContainer) return;

    const container = this.chatContainer.nativeElement;
    container.addEventListener('scroll', () => {
      const threshold = 100;
      const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
      this.isUserAtBottom = atBottom;
    });
  }

  private limitarMensajes(): void {
    if (this.messages.length > 150) {
      this.messages = this.messages.slice(-100);
    }
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
        this.stream = res;
        this.streamUrl = res.url_hls;
        this.cargando = false;

      },
      error: err => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'info' = 'info', duracion: number = 4000) {
  this.snackBar.open(mensaje, 'Cerrar', {
    duration: duracion,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: [
      tipo === 'success' ? 'snack-success' : '',
      tipo === 'error' ? 'snack-error' : '',
      tipo === 'info' ? 'snack-info' : ''
    ]
  });
}

activarStreamManual() {
    if (this.activandoStream || !this.puedeActivarStream()) return;

    this.activandoStream = true;

    this.streamService.activarStream(this.transmisionId, this.userId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.stream.activo = true;
          this.stream.video.estado = 'PROGRAMADO';
          this.actualizarVideoSource();
          this.cargarStreamKeyDelCanal();
          this.mostrarMensaje('✅ Stream activado correctamente. Conecta OBS para transmitir', 'success');
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.message || 'Error al activar el stream';

        if (errorMsg.includes('FINALIZADO') || err.status === 409) {
          this.manejarStreamFinalizado();
        } else {
          this.mostrarMensaje(errorMsg, 'error');
        }
      },
      complete: () => this.activandoStream = false
    });
  }

  private manejarStreamFinalizado() {
      const dialogRef = this.dialog.open(ConfirmarDialogoComponent, {
        width: '480px',
        data: {
          title: 'Stream Finalizado',
          message: 'Este stream ya fue finalizado y no puede ser reutilizado.\n\n¿Deseas crear una nueva transmisión?',
          confirmText: 'Crear Nueva Transmisión',
          cancelText: 'Cerrar'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.irACrearNuevoStream();      
        }
      });
    }

  private irACrearNuevoStream() {

    this.router.navigate(['/crearStream'])
      .then(res => console.log(res))
      .catch(err => console.log(err));

  }
desactivarStreamManual() {
    const dialogRef = this.dialog.open(ConfirmarDialogoComponent, {
      width: '420px',
      data: {
        title: '¿Desactivar Stream?',
        message: '¿Estás seguro que deseas desactivar esta transmisión? Esta acción no se puede deshacer.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ejecutarDesactivacion();
      }
    });
  }

  private ejecutarDesactivacion() {
    this.streamService.desactivarStream(this.transmisionId, this.userId).subscribe({
      next: () => {
        this.stream.activo = false;
        this.isReallyLive = false;
        this.playerHasStarted = false;
        this.metricsPolling$?.unsubscribe();
        this.metricsPolling$ = null;
        this.mostrarMensaje('✅ Stream desactivado correctamente', 'success');
      },
      error: (err) => {
        this.mostrarMensaje(err.error?.message || 'Error al desactivar el stream', 'error');
      }
    });
  }

copiarRTMP() {
  const rtmpUrl = environment.rtmpserver;
  navigator.clipboard.writeText(rtmpUrl).then(() => {
    alert('✅ RTMP copiado al portapapeles');
  });
}


cerrarGuia() {
    this.cerrarGuiaAutomaticamente = true;
    localStorage.setItem('streamGuideClosed', 'true');
  }

volverAMostrarGuia() {
    this.cerrarGuiaAutomaticamente = false;
    localStorage.removeItem('streamGuideClosed');
  }
copiarStreamKey() {
  if (this.streamKey) {
    navigator.clipboard.writeText(this.streamKey).then(() => {
      alert('✅ Clave de stream copiada');
    });
  }
}

copiar(texto: string | null) {
    if (!texto) return;
    navigator.clipboard.writeText(texto).then(() => {
      alert('¡Copiado al portapapeles!');
    });
  } 

getStatusClass(): string {
    if (this.stream?.video?.estado === 'FINALIZADO') return 'finalizado';
    if (this.playerHasStarted) return 'en-vivo';
    if (this.stream?.activo) return 'esperando';
    return 'inactivo';
  }
  getStatusText(): string {
    if (this.stream?.video?.estado === 'FINALIZADO') return 'FINALIZADO';
    if (this.playerHasStarted) return 'EN VIVO';           
    if (this.stream?.activo) return 'Esperando OBS...';
    return 'Inactivo';
  }
getStatusIcon(): string {
  if (this.stream?.video?.estado === 'FINALIZADO') return 'fas fa-stop-circle';
  if (this.playerHasStarted) return 'fas fa-circle text-danger blink';
  if (this.stream?.activo) return 'fas fa-clock text-warning';
  return 'fas fa-pause-circle text-muted';
}

  puedeActivarStream(): boolean {
    if (!this.stream) return false;
    if (this.stream.activo) return false;
    if (this.stream.video?.estado === 'DIRECTO') return false;
    if (this.stream.video?.estado === 'FINALIZADO') return false;
    return true;
  }

  esDuenoDelCanal(): boolean {
    return this.usuario && this.stream?.video?.canal?.user_id === this.usuario.id;
  }

    isActivarDisabled(): boolean {
      return this.stream?.activo === true || 
            this.stream?.video?.estado === 'DIRECTO' || 
            this.stream?.video?.estado === 'FINALIZADO';
    }

    isDesactivarDisabled(): boolean {
      return this.stream?.activo !== true || 
            this.stream?.video?.estado === 'DIRECTO';
    }

actualizarVideoSource() {
  if (!this.playerInitialized) {
    console.log('Player no listo aún, reintentando...');
    setTimeout(() => this.actualizarVideoSource(), 500);
    return;
  }

  if (this.stream?.activo && this.streamUrl) {
    console.log('Cargando stream activo:', this.streamUrl);
    this.cargarHLS();
  } else {
    this.player?.src(null);
    this.playerHasStarted = false;
  }
}


}
