import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstadisticasService } from '../../servicios/estadisticas.service';
import { AuthService } from '../../servicios/auth.service';
import { ThemeService } from '../../servicios/theme.service';
import { SidebarService } from '../../servicios/sidebar.service';
import { Title } from '@angular/platform-browser';
import { Subscription, Observable } from 'rxjs';
import { Videos } from '../../clases/videos';

import { Canal } from '../../clases/canal';

@Component({
  selector: 'app-estadisticas-video',
  templateUrl: './estadisticas-video.component.html',
  styleUrls: ['./estadisticas-video.component.css']
})
export class EstadisticasVideoComponent implements OnInit, OnDestroy {
  videoId: number = 0;
  usuarioId: number = 0;
    usuario: any;

    canalNombre:any
    canal:any;
        canals = new Canal();
        canalId:any;
      sidebarCollapsed$!: Observable<boolean>;
    
  
  video: any = {
    id: 0,
    titulo: '',
    miniatura: '',
    duracion: 0,
    vistas: 0,
    comentarios: 0
  };

  estadisticas: any = {
    vistas: 0,
    tiempoPromedio: 0,
    tasaCompletitud: 0,
    comentarios: 0,
    promedioPuntuacion: 0,
    totalPuntuaciones: 0,
    puntuacionesPorRating: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  };

  detallesVistas: any[] = [];
  historialVistas: any[] = [];

  periodoSeleccionado: string = 'mes';
  periodos = ['semana', 'mes', 'trimestre', 'año'];

  cargando: boolean = false;
  error: string = '';

  currentTheme = this.themeService.temaActual;
  private themeSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private estadisticasService: EstadisticasService,
    private authService: AuthService,
    public themeService: ThemeService,
    private sidebarService: SidebarService,
    private titleService: Title
  ) {
    this.sidebarCollapsed$ = this.sidebarService.sidebarCollapsed$;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.videoId = +params['videoId'];
      this.cargarEstadisticasVideo();
      this.authService.usuario$.subscribe(usuario => {
        if (usuario && usuario.id) {
          this.usuarioId = usuario.id;
           this.obtenerCanal();
          this.cargarEstadisticasVideo();
        }
      });
    });

    this.titleService.setTitle('Estadísticas del Video - Creadores');
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  cargarEstadisticasVideo(): void {
    if (!this.videoId || !this.usuarioId) return;

    this.cargando = true;
    this.error = '';

    this.estadisticasService.obtenerEstadisticasVideo(this.videoId, this.usuarioId).subscribe(
      (data) => {
        const videoData = data.data || data;
        console.log(data)
        this.video = {
          id: videoData.id || this.videoId,
          titulo: videoData.titulo || videoData.title || 'Sin título',
          miniatura: videoData.miniatura || videoData.thumbnail || '',
          duracion: videoData.duracion || videoData.duration || 0
        };

        this.estadisticas = {
          vistas: videoData.vistas || videoData.views || 0,
          tiempoPromedio: videoData.tiempo_promedio_segundos || videoData.tiempo_promedio || videoData.average_watch_time || 0,
          tasaCompletitud: videoData.tasa_completitud || videoData.completion_rate || 0,
          comentarios: videoData.comentarios || videoData.comments || 0,
          promedioPuntuacion: videoData.promedioPuntuacion || videoData.promedio_puntuacion || videoData.average_rating || 0,
          totalPuntuaciones: videoData.totalPuntuaciones || videoData.total_puntuaciones || videoData.total_ratings || 0,
          puntuacionesPorRating: videoData.puntuacionesPorRating || videoData.puntuaciones_por_rating || videoData.ratings_distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };

        this.cargando = false;
      },
      (error) => {
        console.error('Error al cargar estadísticas del video:', error);
        this.error = 'Error al cargar las estadísticas del video';
        this.cargando = false;
      }
    );

    this.estadisticasService.obtenerHistorialVistas(this.usuarioId, this.videoId).subscribe(
      (data) => {
        this.historialVistas = data.data || data || [];
      },
      (error) => {
        console.error('Error al cargar historial de vistas:', error);
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
    this.cargarEstadisticasVideo();
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

  obtenerPorcentajeRating(rating: number): number {
    if (!this.estadisticas.totalPuntuaciones || this.estadisticas.totalPuntuaciones === 0) {
      return 0;
    }
    return (this.estadisticas.puntuacionesPorRating[rating] / this.estadisticas.totalPuntuaciones) * 100;
  }
}
