import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UsuarioGlobalService } from '../../servicios/usuario-global.service';
import { AuthService } from '../../servicios/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar-creador',
  templateUrl: './sidebar-creador.component.html',
  styleUrls: ['./sidebar-creador.component.css'],
})
export class SidebarCreadorComponent implements OnInit {
  sidebarCollapsed$: Observable<boolean> = this.usuarioGlobal.sidebarCollapsed$;
  usuario: any;
  canalNombre: string = '';

  constructor(
    private usuarioGlobal: UsuarioGlobalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      if (usuario) {
        this.obtenerCanal(usuario.id);
      }
    });
  }

  obtenerCanal(userId: number): void {
    this.authService.obtenerCanalDelUsuario(userId).subscribe((res: any) => {
      if (res && res.canales) {
        this.canalNombre = res.canales.nombre || 'Mi Canal';
      }
    });
  }

}
