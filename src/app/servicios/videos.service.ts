import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Videos } from '../clases/videos';
import { Etiqueta } from '../clases/etiqueta';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  private api = 'http://localhost:8001/api/v1/videos/'
  private etiquetas = 'http://localhost:8001/api/v1/etiquetas/'


  constructor(private httpClient: HttpClient, private cookie:CookieService) { }

  listarVideo():Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    }
    const url = `${this.api}listar`;
    return this.httpClient.get<Videos>(url, httpOptions);
  }

 


  listarEtiquetas(): Observable<Etiqueta[]> {
    const httpOptions = {
    }
    return this.httpClient.get<Etiqueta[]>(this.etiquetas, httpOptions);
  }

  obtenerInformacionVideo(idVideo: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    }

    const url = `${this.api}${idVideo}`;
    return this.httpClient.get(url, httpOptions);
  }

  listarVideosDelUsuario():Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
      })
    }
    const url = `${this.api}`;
    return this.httpClient.get<Videos>(url, httpOptions);
  }



  subirVideo(idCanal:any, video:FormData): Observable<any> {
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization' : 'Bearer ' + this.cookie.get('accessToken') 
      })
    }
    const url = `${this.api}canal/${idCanal}`;
    return this.httpClient.post(url, video, httpOptions); 
   }


   eliminarVideo(idVideo: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    }
    const url = `${this.api}${idVideo}`;
    return this.httpClient.delete(url, httpOptions);
  }

  editarVideo(idVideo: any, video:FormData): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    }

    const url = `${this.api}${idVideo}`;
    return this.httpClient.post(url, video, httpOptions);
  }


  listarVideosPorNombre(nombre:any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken') 
      })
    }

    const url = `${this.api}buscar/${nombre}`;
    return this.httpClient.get(url, httpOptions);
  }




}

