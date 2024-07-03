import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authApiUrl = environment.authApiUrl;
  private apiUrl = environment.apiUrl;
  private usuarioSubject = new BehaviorSubject<any>(null);
  public usuario$: Observable<any> = this.usuarioSubject.asObservable();


  constructor(private http: HttpClient, private cookie: CookieService) { }

  mostrarUserLogueado() {
    const url = `${this.authApiUrl}api/v1/validate`
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.cookie.get('accessToken')
      })
    };
    return this.http.get(url, httpOptions).pipe(
      tap(user => this.usuarioSubject.next(user))
    );
  }
  
  obtenerCanalDelUsuario(id:number) {
    const url = `${this.apiUrl}api/v1/usuario/${id}`
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + this.cookie.get('accessToken')
      })
    } 
    return this.http.get(url, httpOptions);
  }

  


}
