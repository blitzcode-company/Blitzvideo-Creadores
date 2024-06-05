import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { StatusService } from '../../servicios/status.service';
import { CookieService } from 'ngx-cookie-service';
import { Canal } from '../../clases/canal';


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


  usuario:any;
  canal:any;
  canals = new Canal();
  canalId:any;
  canalNombre:any


  obtenerUsuario() {
    this.api.mostrarUserLogueado().subscribe(
      (res) => {
        this.usuario = res;
        console.log(res);
        this.obtenerCanal();

      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    );
  }


  obtenerCanal() {
    this.api.obtenerCanalDelUsuario(this.usuario.id).subscribe((res: any) => {
      this.canal = res;
      if (res.canales && res.canales.length > 0) {
        this.canalId = res.canales[0].id;
        this.canalNombre = res.canales[0].nombre;
        console.log(res.canales[0].id);
      } else {
        console.error('El usuario no tiene canal hecho');
      }
    });
  }

  logout() {
    localStorage.removeItem("accessToken");
    this.cookie.delete('accessToken');
    this.status.isLoggedIn = false;
    this.router.navigateByUrl("/login")

  }

  isDropdownOpen = false;

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('Dropdown toggled:', this.isDropdownOpen); // Para depuración
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}


 

