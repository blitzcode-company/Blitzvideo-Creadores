import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient, private cookie: CookieService) { }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.cookie.get('accessToken')
      })
    };
  }

  obtenerResumenEstadisticas(usuarioId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/studio`;
    return this.httpClient.post(url, { user_id: usuarioId }, this.getHttpOptions());
  }

  obtenerEstadisticasVideo(videoId: number, usuarioId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/studio/videos/${videoId}/estadisticas`;
    return this.httpClient.post(url, { user_id: usuarioId }, this.getHttpOptions());
  }

  obtenerVistasporPeriodo(usuarioId: number, periodo: string = 'mes'): Observable<any> {
    const url = `${this.apiUrl}api/v1/studio/vistas-periodo?periodo=${periodo}`;
    return this.httpClient.post(url, { user_id: usuarioId }, this.getHttpOptions());
  }

  obtenerVideosConMejorRendimiento(usuarioId: number, limite: number = 5): Observable<any> {
    const url = `${this.apiUrl}api/v1/studio/videos-top?limite=${limite}`;
    return this.httpClient.post(url, { user_id: usuarioId }, this.getHttpOptions());
  }

  obtenerDatosAudiencia(usuarioId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/studio/audiencia`;
    return this.httpClient.post(url, { user_id: usuarioId }, this.getHttpOptions());
  }

  obtenerDistribucionPaises(usuarioId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/studio/paises`;
    return this.httpClient.post(url, { user_id: usuarioId }, this.getHttpOptions());
  }

  obtenerDatosSuscriptores(usuarioId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/studio/suscriptores`;
    return this.httpClient.post(url, { user_id: usuarioId }, this.getHttpOptions());
  }

  obtenerHistorialVistas(usuarioId: number, videoId?: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/studio/vistas`;
    const body = { 
      user_id: usuarioId,
      ...(videoId && { video_id: videoId })
    };
    return this.httpClient.post(url, body, this.getHttpOptions());
  }

  obtenerTiempoPromedioVisualizacion(usuarioId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/studio/tiempo-promedio`;
    return this.httpClient.post(url, { user_id: usuarioId }, this.getHttpOptions());
  }

  obtenerTasaCompletitud(usuarioId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/studio/tasa-completitud`;
    return this.httpClient.post(url, { user_id: usuarioId }, this.getHttpOptions());
  }

  obtenerEngagement(usuarioId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/studio/engagement`;
    return this.httpClient.post(url, { user_id: usuarioId }, this.getHttpOptions());
  }

  obtenerIngresos(usuarioId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/studio/ingresos`;
    return this.httpClient.post(url, { user_id: usuarioId }, this.getHttpOptions());
  }
}
