import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class StreamService {

  constructor(private httpClient: HttpClient, private cookie:CookieService) { }

  private apiUrl = environment.apiUrl

  crearTransmision(formData: FormData, canalId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    }
    const url = `${this.apiUrl}api/v1/streams/canal/${canalId}`;
    return this.httpClient.post(url, formData, httpOptions);

  }

  obtenerDatosTransmision(transmisionId: any) {
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.cookie.get('accessToken')
        }),
      
    };

    const url = `${this.apiUrl}api/v1/streams/${transmisionId}`;

    return this.httpClient.get<any>(url, httpOptions);
  }

  obtenerStats(streamId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.cookie.get('accessToken')
      }),
    
  };

  const url = `${this.apiUrl}api/v1/streams/${streamId}/stats`;
  return this.httpClient.get<any>(url, httpOptions);

  }

  eliminarStream(canalId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',

        'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    }
    const url = `${this.apiUrl}api/v1/streams/canal/${canalId}`;
    return this.httpClient.delete(url, httpOptions);
  }


}
