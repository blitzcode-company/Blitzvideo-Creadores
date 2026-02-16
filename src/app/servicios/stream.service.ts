import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { timer } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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

  activarStream(streamId: number, userId: number): Observable<any> {
    const body = {
      stream_id: streamId,
      user_id: userId
    };

    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.cookie.get('accessToken')
      }),
    
    };

    const url = `${this.apiUrl}api/v1/streams/activar`;
    return this.httpClient.post<any>(url, body, httpOptions );
  }


  desactivarStream(streamId:number, userId: number): Observable<any> {
    const body = {
      stream_id: streamId,
      user_id: userId
    };

    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.cookie.get('accessToken')
      }),
    
    };

    const url = `${this.apiUrl}api/v1/streams/desactivar`;
    return this.httpClient.post<any>(url, body, httpOptions );
  }


getStreamMetrics(streamKey: string): Observable<any> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.cookie.get('accessToken')
    })
  };

  const url = `${this.apiUrl}api/v1/streams/metrics/${streamKey}`;
  return this.httpClient.get(url, httpOptions);
}

  startMetricsPolling(streamKey: string, intervalMs = 5000): Observable<any> {
    return timer(0, intervalMs).pipe(
      switchMap(() => this.getStreamMetrics(streamKey)),
      shareReplay(1)
    );
  }

    obtenerInformacionRTMP(idCanal: any, userId: number): Observable<any> {
    const params = new HttpParams().set('user_id', userId.toString());
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.cookie.get('accessToken')
        }),
        params: params
    };
    const url = `${this.apiUrl}api/v1/streams/canal/${idCanal}`;
    return this.httpClient.get<any>(url, httpOptions);
}

obtenerViewers(streamId: number): Observable<any> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.cookie.get('accessToken')
    })
  };

  const url = `${this.apiUrl}api/v1/streams/${streamId}/viewers`;
  return this.httpClient.get(url, httpOptions);
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
