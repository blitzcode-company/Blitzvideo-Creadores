import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ComentariosService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerComentarios(videoId: number, usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.api}api/v1/videos/${videoId}/comentarios?usuario_id=${usuarioId}`
    );
  }

  eliminarComentario(comentarioId: number, usuarioId: number): Observable<any> {
    return this.http.delete(`${this.api}api/v1/videos/comentarios/${comentarioId}`, {
      body: { usuario_id: usuarioId }
    });
  }

  darMeGusta(comentarioId: number, usuarioId: number): Observable<any> {
    return this.http.post(
      `${this.api}api/v1/videos/comentarios/${comentarioId}/me-gusta`,
      { usuario_id: usuarioId }
    );
  }

  responderComentario(comentarioId: number, usuarioId: number, mensaje: string): Observable<any> {
  return this.http.post(
    `${this.api}api/v1/videos/comentarios/respuesta/${comentarioId}`,
    { usuario_id: usuarioId, mensaje }
  );
}

  quitarMeGusta(meGustaId: number, usuarioId: number): Observable<any> {
    return this.http.delete(
      `${this.api}api/v1/videos/comentarios/me-gusta/${meGustaId}`,
      { body: { usuario_id: usuarioId } }
    );
  }
}