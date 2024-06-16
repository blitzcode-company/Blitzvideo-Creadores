import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Canal } from '../clases/canal';
import { CookieService } from 'ngx-cookie-service';



@Injectable({
  providedIn: 'root'
})
export class CanalService {

  constructor(private httpClient: HttpClient, private cookie:CookieService) { }

  private api = 'http://localhost:8001/api/v1/canal/'

  listarVideosDeCanal(canalId: any): Observable<any> {
    const url = `${this.api}${canalId}/videos`;
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    }
    return this.httpClient.get(url, httpOptions);
  }

  crearCanal(userId: any, canal:any): Observable<any> {
    const url = `${this.api}${userId}`;
    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    }
    return this.httpClient.post(url, canal, httpOptions);
  }

  darDeBajaCanal(canalId: string): Observable<any> {
    const url = `${this.api}${canalId}`;
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken') 
      })
    }
    return this.httpClient.delete(url, httpOptions);
  }


}
