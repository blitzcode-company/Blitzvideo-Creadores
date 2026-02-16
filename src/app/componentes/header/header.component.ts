import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { StatusService } from '../../servicios/status.service';
import { CookieService } from 'ngx-cookie-service';
import { Canal } from '../../clases/canal';
import { environment } from '../../../environments/environment.prod';
import { SidebarService } from '../../servicios/sidebar.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  constructor(private api:AuthService, 
              private router:Router, 
              public status:StatusService,
              public cookie:CookieService,
              private sidebarService:SidebarService){}      

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
  historialFiltrado: string[] = [];
  historialBusquedas: string[] = [];
  maxHistorial = 5;

  obtenerUsuario() {
    this.api.usuario$.subscribe(user => {
      this.usuario = user;
  
      if (this.usuario) {
        this.obtenerCanal();
      } 
    });
  
    this.api.mostrarUserLogueado().subscribe();
  }

  cargarHistorialBusquedas() {
    const historial = localStorage.getItem('historialBusquedas');
    if (historial) {
      this.historialBusquedas = JSON.parse(historial).slice(-this.maxHistorial);
    }
  }
  
  guardarBusqueda(nombre: string) {
    if (!nombre || nombre.trim() === '') return;
    
    this.historialBusquedas = [nombre, ...this.historialBusquedas.filter(b => b !== nombre)];
    
    this.historialBusquedas = this.historialBusquedas.slice(0, this.maxHistorial);
    
    localStorage.setItem('historialBusquedas', JSON.stringify(this.historialBusquedas));
  }

  filtrarHistorial() {
    if (!this.nombre) {
      this.historialFiltrado = [];
      return;
    }
    const termino = this.nombre.toLowerCase();
    this.historialFiltrado = this.historialBusquedas.filter(busqueda => 
      busqueda.toLowerCase().includes(termino)
    ).slice(0, 5);
  }
  
  seleccionarBusqueda(busqueda: string) {
    this.nombre = busqueda;
    this.historialFiltrado = [];
    this.buscarVideos();
  }
  
  eliminarBusqueda(busqueda: string) {
    this.historialBusquedas = this.historialBusquedas.filter(b => b !== busqueda);
    localStorage.setItem('historialBusquedas', JSON.stringify(this.historialBusquedas));
    this.filtrarHistorial();
  }
  
  limpiarHistorial() {
    this.historialBusquedas = [];
    localStorage.removeItem('historialBusquedas');
    this.historialFiltrado = [];
  }
  

  buscarVideos() {
    if (this.nombre?.trim()) {
      this.guardarBusqueda(this.nombre.trim());
      window.location.href = `${this.serverIp}3000/buscar/${this.nombre}`, { 
        queryParams: { q: this.nombre.trim() } 
      };
    }
    if (this.mobileSearchActive) this.toggleMobileSearch();
  }

  
  onSearchInput() {
    this.cargarHistorialBusquedas();
  }
  
  mobileSearchActive = false;

  toggleMobileSearch() {
    this.mobileSearchActive = !this.mobileSearchActive;
    if (this.mobileSearchActive) {
      setTimeout(() => this.cargarHistorialBusquedas(), 100);
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

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}


 

