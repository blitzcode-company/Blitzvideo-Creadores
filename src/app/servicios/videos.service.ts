import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Videos } from '../clases/videos';
import { Etiqueta } from '../clases/etiqueta';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  private apiUrl = environment.apiUrl
  constructor(private httpClient: HttpClient, private cookie:CookieService) { }

  listarVideo():Observable<any> {
    const url = `${this.apiUrl}api/v1/videos/listar`;
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    }
    return this.httpClient.get<Videos>(url, httpOptions);
  }

  listarEtiquetas(): Observable<Etiqueta[]> {
    const url = `${this.apiUrl}api/v1/etiquetas/`
    return this.httpClient.get<Etiqueta[]>(url);
  }

  obtenerInformacionVideo(idVideo: any): Observable<any> {
    const url = `${this.apiUrl}api/v1/videos/${idVideo}`;
    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    }

    return this.httpClient.get(url, httpOptions);
  }

  listarVideosDelUsuario():Observable<any> {
    const url = `${this.apiUrl}api/v1/videos/`;
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
      })
    }
    return this.httpClient.get<Videos>(url, httpOptions);
  }

  subirVideo(idCanal:any, video:FormData): Observable<any> {
    const url = `${this.apiUrl}api/v1/videos/canal/${idCanal}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization' : 'Bearer ' + this.cookie.get('accessToken') 
      })
    }
    return this.httpClient.post(url, video, httpOptions); 
   }


   eliminarVideo(idVideo: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    }
    const url = `${this.apiUrl}api/v1/videos/${idVideo}`;
    return this.httpClient.delete(url, httpOptions);
  }

  editarVideo(idVideo: any, video:FormData): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    }
    const url = `${this.apiUrl}api/v1/videos/${idVideo}`;
    return this.httpClient.post(url, video, httpOptions);
  }


  listarVideosPorNombre(nombre:any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken') 
      })
    }
    const url = `${this.apiUrl}api/v1/videos/buscar/${nombre}`;
    return this.httpClient.get(url, httpOptions);
  }


  subirVideoConProgress(idCanal: any, video: FormData): Observable<any> {
    const url = `${this.apiUrl}api/v1/videos/canal/${idCanal}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.cookie.get('accessToken')
      })
    };
    return this.httpClient.post(url, video, { 
      ...httpOptions, 
      reportProgress: true, 
      observe: 'events' 
    });
  }

}

