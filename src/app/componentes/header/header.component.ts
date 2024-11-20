import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { StatusService } from '../../servicios/status.service';
import { CookieService } from 'ngx-cookie-service';
import { Canal } from '../../clases/canal';
import { environment } from '../../../environments/environment.prod';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  constructor(private api:AuthService, 
              private router:Router, 
              public status:StatusService,
              public cookie:CookieService){}      

              ngOnInit() {
                this.obtenerUsuario();
              }
              

  public loggedIn: boolean=false;
serverIp = environment.serverIp

  usuario:any;
  canal:any;
  canals = new Canal();
  canalId:any;
  canalNombre:any
  nombre: string = '';


  obtenerUsuario() {
    this.api.usuario$.subscribe(user => {
      this.usuario = user;
  
      if (this.usuario) {
        this.obtenerCanal();
      } 
    });
  
    this.api.mostrarUserLogueado().subscribe();
  }

  buscarVideos(): void {
    if (this.nombre.trim()) {
      window.location.href = `${this.serverIp}3000/buscar/${this.nombre}`; 

    }
  }

  obtenerCanal(): void {
    if (this.usuario && this.usuario.id) {
      this.api.obtenerCanalDelUsuario(this.usuario.id).subscribe(
        (res: any) => {
          this.canal = res;
  
          if (res.canales) {
            this.canalId = res.canales.id;
            this.canalNombre = res.canales.nombre;
          } else {
            this.canalId = null;
            console.error('El usuario no tiene canal creado');
          }
        },
        (error) => {
          console.error('Error al obtener el canal:', error);
        }
      );
    } else {
      this.canalId = null;
    }
  }

  logout() {
    localStorage.removeItem("accessToken");
    this.cookie.delete('accessToken');
    this.status.isLoggedIn = false;
    window.location.href = `${this.serverIp}3000/#/`; 

  }

  isDropdownOpen = false;

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}


 

