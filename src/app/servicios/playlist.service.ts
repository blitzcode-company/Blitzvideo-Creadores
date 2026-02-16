import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) { }

  obtenerListasDeReproduccion(userId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/playlists/${userId}/playlists`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.cookie.get('accessToken')
      })
    };
    return this.http.get(url, httpOptions);
  }

  obtenerListasDeReproduccionDelCanal(canalId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/playlists/canal/${canalId}/playlists`;
    let params = new HttpParams();
    if (userId && userId > 0) {
      params = params.set('user_id', userId.toString());
    }
    return this.http.get(url, { params });
  }

  crearLista(nombre: string, acceso: boolean, userId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/playlists`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.cookie.get('accessToken')
      })
    };
    return this.http.post(url, { nombre, acceso, user_id: userId }, httpOptions);
  }

  agregarVideosALista(playlistId: number, videoIds: number[]): Observable<any> {
    const url = `${this.apiUrl}api/v1/playlists/${playlistId}/videos`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.cookie.get('accessToken')
      })
    };
    return this.http.post(url, { video_ids: videoIds }, httpOptions);
  }

  quitarVideoDePlaylist(playlistId: number, videoId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/playlists/${playlistId}/videos`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.cookie.get('accessToken')
      }),
      body: { video_id: videoId }
    };
    return this.http.delete(url, httpOptions);
  }

  borrarPlaylist(playlistId: number): Observable<any> {
    const url = `${this.apiUrl}api/v1/playlists/${playlistId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.cookie.get('accessToken')
      })
    };
    return this.http.delete(url, httpOptions);
  }

  modificarPlaylist(playlistId: number, nombre: string, acceso: boolean): Observable<any> {
    const url = `${this.apiUrl}api/v1/playlists/${playlistId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.cookie.get('accessToken')
      })
    };
    return this.http.put(url, { nombre, acceso }, httpOptions);
  }
}
