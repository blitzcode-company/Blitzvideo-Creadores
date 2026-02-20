import { Component, OnInit, OnDestroy } from '@angular/core';
import { EstadisticasService } from '../../servicios/estadisticas.service';
import { UsuarioGlobalService } from '../../servicios/usuario-global.service';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../servicios/theme.service';
import { SidebarService } from '../../servicios/sidebar.service';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Canal } from '../../clases/canal';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, OnDestroy {
  usuario: any;
  usuarioId: number = 0;
  canalNombre:any
  serverIp = environment.serverIp
  canal:any;
      canals = new Canal();
      canalId:any;
    sidebarCollapsed$!: Observable<boolean>;
  
  resumen: any = {
    totalVistas: 0,
    totalSuscriptores: 0,
    videosSubidos: 0,
    tasa_completitud: 0,
    tiempo_promedio: 0
  };

  videosConMejorRendimiento: any[] = [];
  
  datosAudiencia: any = {
    nuevosSuscriptores: 0,
    suscriptoresPeridos: 0,
    tasaCrecimiento: 0
  };

  datosVisualizacion: any = {
    vistasHoy: 0,
    vistasSemana: 0,
    vistasMes: 0
  };

  engagement: any = {
    meGustas: 0,
    comentarios: 0,
    compartidos: 0
  };

  periodoSeleccionado: string = 'mes';
  periodos = ['semana', 'mes', 'trimestre', 'año'];

  cargandoResumen: boolean = false;
  cargandoVideos: boolean = false;
  cargandoAudiencia: boolean = false;
  error: string = '';

  currentTheme = this.themeService.temaActual;
  private themeSubscription: Subscription | null = null;

  constructor(
    private estadisticasService: EstadisticasService,
    private usuarioGlobal: UsuarioGlobalService,
    private titleService: Title,
    private authService: AuthService, 
    private router: Router,
    private sidebarService: SidebarService,
    public themeService: ThemeService
  ) {
    this.titleService.setTitle('Estadísticas - Creadores');
    this.sidebarCollapsed$ = this.sidebarService.sidebarCollapsed$;
  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      if (usuario && usuario.id) {
        this.usuario = usuario;
        this.usuarioId = usuario.id;
        this.cargarEstadisticas();
              if (this.usuario) {
        this.obtenerCanal();
      }
      }

    });

    
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  cargarEstadisticas(): void {
    if (!this.usuarioId) return;

    this.cargandoResumen = true;
    this.cargandoVideos = true;
    this.cargandoAudiencia = true;
    this.error = '';

    this.estadisticasService.obtenerResumenEstadisticas(this.usuarioId).subscribe(
      (data) => {
        this.resumen = data.data || data;
        this.cargandoResumen = false;
      },
      (error) => {
        console.error('Error al cargar resumen:', error);
        this.error = 'Error al cargar las estadísticas generales';
        this.cargandoResumen = false;
      }
    );

    this.estadisticasService.obtenerVideosConMejorRendimiento(this.usuarioId, 5).subscribe(
      (data) => {
        this.videosConMejorRendimiento = data.data || data || [];
        this.cargandoVideos = false;
      },
      (error) => {
        console.error('Error al cargar videos:', error);
        this.cargandoVideos = false;
      }
    );

    this.estadisticasService.obtenerDatosAudiencia(this.usuarioId).subscribe(
      (data) => {
        this.datosAudiencia = data.data || data || {};
        this.cargandoAudiencia = false;
      },
      (error) => {
        console.error('Error al cargar datos de audiencia:', error);
        this.cargandoAudiencia = false;
      }
    );

    this.estadisticasService.obtenerEngagement(this.usuarioId).subscribe(
      (data) => {
        this.engagement = data.data || data || {};
      },
      (error) => {
        console.error('Error al cargar engagement:', error);
      }
    );
  }


  obtenerCanal() {
    this.authService.obtenerCanalDelUsuario(this.usuarioId).subscribe((res: any) => {
      this.canal = res;
      if (res.canales) {
        this.canalId = res.canales.id;
        this.canalNombre = res.canales.nombre;
      } else {
        console.error('El usuario no tiene canal hecho');
      }
    });
  }

  cambiarPeriodo(nuevoPeriodo: string): void {
    this.periodoSeleccionado = nuevoPeriodo;
    this.estadisticasService.obtenerVistasporPeriodo(this.usuarioId, nuevoPeriodo).subscribe(
      (data) => {
        console.log('Datos del período:', data);
      },
      (error) => {
        console.error('Error al cargar datos del período:', error);
      }
    );
  }

  formatearNumero(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }


  formatearDuracion(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const secs = Math.floor(segundos % 60);

    if (horas > 0) {
      return `${horas}h ${minutos}m ${secs}s`;
    } else if (minutos > 0) {
      return `${minutos}m ${secs}s`;
    }
    return `${secs}s`;
  }


  getRatingEmoji(rating: number): string {
    switch(rating) {
      case 5: return 'assets/images/5.svg';
      case 4: return 'assets/images/4.svg';
      case 3: return 'assets/images/3.svg';
      case 2: return 'assets/images/2.svg';
      case 1: return 'assets/images/1.svg';
      default: return 'assets/images/3.svg';
    }
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/video-default.png';
  }
}
