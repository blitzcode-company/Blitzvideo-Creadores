import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstadisticasService } from '../../servicios/estadisticas.service';
import { AuthService } from '../../servicios/auth.service';
import { ThemeService } from '../../servicios/theme.service';
import { SidebarService } from '../../servicios/sidebar.service';
import { Title } from '@angular/platform-browser';
import { Subscription, Observable } from 'rxjs';
import { Canal } from '../../clases/canal';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-estadisticas-video',
  templateUrl: './estadisticas-video.component.html',
  styleUrls: ['./estadisticas-video.component.css']
})
export class EstadisticasVideoComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('viewsChart') viewsChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('retentionChart') retentionChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trafficChart') trafficChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  videoId: number = 0;
  usuarioId: number = 0;
  usuario: any;
  canalNombre: any;
  canal: any;
  canals = new Canal();
  canalId: any;
  sidebarCollapsed$!: Observable<boolean>;

  video: any = {
    id: 0,
    titulo: '',
    miniatura: '',
    duracion: 0
  };

  estadisticas: any = {
    vistas: 0,
    tiempoPromedio: 0,
    tasaCompletitud: 0,
    comentarios: 0,
    promedioPuntuacion: 0,
    totalPuntuaciones: 0,
    puntuacionesPorRating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };

  historialVistas: any[] = [];
  
  datosRetencion: any[] = [];
  fuentesTrafico: any = {
    busqueda: 45,
    directo: 25,
    externo: 20,
    recomendado: 10
  };

  vistasPorFecha: any[] = [];

  periodoSeleccionado: string = 'mes';
  periodos = ['semana', 'mes', 'trimestre', 'año'];

  cargando: boolean = false;
  error: string = '';

  currentTheme = this.themeService.temaActual;
  private themeSubscription: Subscription | null = null;

  private viewsChart: Chart | null = null;
  private retentionChart: Chart | null = null;
  private trafficChart: Chart | null = null;

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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inicializarGraficos();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    this.destruirGraficos();
  }

  cargarEstadisticasVideo(): void {
    if (!this.videoId || !this.usuarioId) return;

    this.cargando = true;
    this.error = '';

    this.estadisticasService.obtenerEstadisticasVideo(this.videoId, this.usuarioId).subscribe(
      (data) => {
        const videoData = data.data || data;
        
        this.video = {
          id: videoData.id || this.videoId,
          titulo: videoData.titulo || 'Sin título',
          miniatura: videoData.miniatura || '',
          duracion: videoData.duracion || 0
        };

        this.estadisticas = {
          vistas: videoData.vistas || 0,
          tiempoPromedio: videoData.tiempo_promedio_segundos || 0,
          tasaCompletitud: videoData.tasa_completitud || 0,
          comentarios: videoData.comentarios || 0,
          promedioPuntuacion: videoData.promedioPuntuacion || 0,
          totalPuntuaciones: videoData.totalPuntuaciones || 0,
          puntuacionesPorRating: videoData.puntuacionesPorRating || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };

        this.generarDatosRetencion();
        
        this.generarDatosVistasPorFecha();

        this.cargando = false;
        this.actualizarGraficos();
      },
      (error) => {
        console.error('Error al cargar estadísticas del video:', error);
        this.error = 'Error al cargar las estadísticas del video';
        this.cargando = false;
      }
    );
  }

  generarDatosRetencion(): void {
    const duracionTotal = this.video.duracion || 117;
    const tasaCompletitud = this.estadisticas.tasaCompletitud / 100; 
    const tiempoPromedio = this.estadisticas.tiempoPromedio;
    
    this.datosRetencion = [];
    
    const puntos = Math.min(10, Math.ceil(duracionTotal / 10));
    const intervalo = duracionTotal / puntos;
    
    for (let i = 0; i <= puntos; i++) {
      const minuto = Math.floor(i * intervalo);
      let retencion = 100;
      
      if (minuto > 0) {
        const tiempoTranscurrido = minuto;
        const factorDecaimiento = Math.exp(-tiempoTranscurrido / (tiempoPromedio || 10));
        retencion = Math.max(0, Math.min(100, 100 * factorDecaimiento));
        
        if (minuto >= duracionTotal * 0.9) {
          retencion = tasaCompletitud * 100;
        }
      }
      
      this.datosRetencion.push({
        minuto: minuto,
        retencion: Math.round(retencion * 10) / 10
      });
    }
  }

  generarDatosVistasPorFecha(): void {
    const totalVistas = this.estadisticas.vistas;
    const hoy = new Date();
    this.vistasPorFecha = [];
    
    for (let i = 29; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() - i);
      const fechaStr = `${fecha.getDate()}/${fecha.getMonth() + 1}`;
      
      let vistas = 0;
      if (i === 0) {
        vistas = Math.floor(totalVistas * 0.15); 
      } else if (i < 7) {
        vistas = Math.floor(totalVistas * 0.4 / 7); 
      } else if (i < 14) {
        vistas = Math.floor(totalVistas * 0.25 / 7);
      } else {
        vistas = Math.floor(totalVistas * 0.2 / 16); 
      }
      
      this.vistasPorFecha.push({
        fecha: fechaStr,
        vistas: Math.max(1, vistas)
      });
    }
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
    this.actualizarGraficoVistas();
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
    if (!segundos || segundos === 0) return '0s';
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
    const valor = this.estadisticas.puntuacionesPorRating[rating] || 0;
    return (valor / this.estadisticas.totalPuntuaciones) * 100;
  }


  inicializarGraficos(): void {
    this.inicializarGraficoVistas();
    this.inicializarGraficoRetencion();
    this.inicializarGraficoTrafico();
  }

  destruirGraficos(): void {
    if (this.viewsChart) {
      this.viewsChart.destroy();
      this.viewsChart = null;
    }
    if (this.retentionChart) {
      this.retentionChart.destroy();
      this.retentionChart = null;
    }
    if (this.trafficChart) {
      this.trafficChart.destroy();
      this.trafficChart = null;
    }
  }

  actualizarGraficos(): void {
    this.actualizarGraficoVistas();
    this.actualizarGraficoRetencion();
    this.actualizarGraficoTrafico();
  }

  private obtenerColoresTema() {
    const tema = this.themeService.temaActual();

    const isDark = tema === 'dark' || 
      (tema === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return {
      textColor: isDark ? '#e0e0e0' : '#333333',
      gridColor: isDark ? '#333333' : '#e8eaed',
      primaryColor: '#007bff',
      secondaryColor: isDark ? '#64b5f6' : '#0056b3'
    };
  }
  inicializarGraficoVistas(): void {
    if (!this.viewsChartCanvas) return;

    const colores = this.obtenerColoresTema();
    
    this.viewsChart = new Chart(this.viewsChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.vistasPorFecha.map(d => d.fecha),
        datasets: [{
          label: 'Vistas',
          data: this.vistasPorFecha.map(d => d.vistas),
          borderColor: colores.primaryColor,
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: colores.primaryColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: colores.textColor }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return `Vistas: ${context.parsed.y!.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: colores.gridColor },
            ticks: { color: colores.textColor },
            title: {
              display: true,
              text: 'Número de vistas',
              color: colores.textColor
            }
          },
          x: {
            grid: { color: colores.gridColor },
            ticks: { 
              color: colores.textColor,
              maxRotation: 45,
              minRotation: 45
            },
            title: {
              display: true,
              text: 'Fecha',
              color: colores.textColor
            }
          }
        }
      }
    });
  }

  actualizarGraficoVistas(): void {
    if (!this.viewsChart) return;

    let datosFiltrados = [...this.vistasPorFecha];
    
    switch(this.periodoSeleccionado) {
      case 'semana':
        datosFiltrados = datosFiltrados.slice(-7);
        break;
      case 'mes':
        datosFiltrados = datosFiltrados.slice(-30);
        break;
      case 'trimestre':
        datosFiltrados = datosFiltrados.slice(-90);
        break;
      default:
        break;
    }

    const colores = this.obtenerColoresTema();
    this.viewsChart.data.labels = datosFiltrados.map(d => d.fecha);
    this.viewsChart.data.datasets[0].data = datosFiltrados.map(d => d.vistas);
    this.viewsChart.options!.plugins!.legend!.labels!.color = colores.textColor;
    this.viewsChart.update();
  }

  inicializarGraficoRetencion(): void {
    if (!this.retentionChartCanvas) return;

    const colores = this.obtenerColoresTema();
    
    this.retentionChart = new Chart(this.retentionChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.datosRetencion.map(d => {
          if (d.minuto < 60) return `${d.minuto}s`;
          const minutos = Math.floor(d.minuto / 60);
          const segundos = d.minuto % 60;
          return `${minutos}:${segundos.toString().padStart(2, '0')}`;
        }),
        datasets: [{
          label: 'Retención de audiencia (%)',
          data: this.datosRetencion.map(d => d.retencion),
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#28a745',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: colores.textColor }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Retención: ${context.parsed.y}%`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: colores.gridColor },
            ticks: { 
              color: colores.textColor,
              callback: function(val) {
                return val + '%';
              }
            },
            title: {
              display: true,
              text: 'Porcentaje de retención',
              color: colores.textColor
            }
          },
          x: {
            grid: { color: colores.gridColor },
            ticks: { 
              color: colores.textColor,
              maxRotation: 45,
              minRotation: 45
            },
            title: {
              display: true,
              text: 'Tiempo del video',
              color: colores.textColor
            }
          }
        }
      }
    });
  }

  actualizarGraficoRetencion(): void {
    if (!this.retentionChart) return;
    
    const colores = this.obtenerColoresTema();
    this.retentionChart.options!.plugins!.legend!.labels!.color = colores.textColor;
    this.retentionChart.update();
  }

  inicializarGraficoTrafico(): void {
    if (!this.trafficChartCanvas) return;

    const colores = this.obtenerColoresTema();
    
    this.trafficChart = new Chart(this.trafficChartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Búsqueda', 'Directo', 'Externo', 'Recomendado'],
        datasets: [{
          data: [
            this.fuentesTrafico.busqueda,
            this.fuentesTrafico.directo,
            this.fuentesTrafico.externo,
            this.fuentesTrafico.recomendado
          ],
          backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { 
              color: colores.textColor,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const porcentaje = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${context.parsed}% (${porcentaje}% del total)`;
              }
            }
          }
        }
      }
    });
  }

  actualizarGraficoTrafico(): void {
    if (!this.trafficChart) return;
    
    const colores = this.obtenerColoresTema();
    this.trafficChart.options!.plugins!.legend!.labels!.color = colores.textColor;
    this.trafficChart.update();
  }
}