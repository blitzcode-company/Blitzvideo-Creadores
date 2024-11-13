import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Canal } from '../clases/canal';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CanalService {

  constructor(private httpClient: HttpClient, private cookie:CookieService) { }

  private apiUrl = environment.apiUrl

  listarVideosDeCanal(canalId: any): Observable<any> {
    const url = `${this.apiUrl}api/v1/canal/${canalId}/videos`;
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
      })
    }
    return this.httpClient.get(url, httpOptions);
  }

  obtenerCanalPorId(canalId: any): Observable<any> {
    const url = `${this.apiUrl}canal/${canalId}`;
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
      })
    }
    return this.httpClient.get(url, httpOptions);
  }
  obtenerUsuarioPorId(userId: any): Observable<any> {
    const url = `${this.apiUrl}usuario/${userId}`;
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
      })
    }
    return this.httpClient.get(url, httpOptions);
  }

 
  crearCanal(userId: any, formData: FormData): Observable<any> {
    const url = `${this.apiUrl}api/v1/canal/${userId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    }
    return this.httpClient.post(url, formData, httpOptions);
  }

  darDeBajaCanal(canalId: string): Observable<any> {
    const url = `${this.apiUrl}api/v1/canal/${canalId}`;
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken') 
      })
    }
    return this.httpClient.delete(url, httpOptions);
  }


}
