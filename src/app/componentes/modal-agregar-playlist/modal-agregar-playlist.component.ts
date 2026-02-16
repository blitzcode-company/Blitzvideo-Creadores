import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlaylistService } from '../../servicios/playlist.service';
import { AuthService } from '../../servicios/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface DialogData {
  videoIds: number[];
}

@Component({
  selector: 'app-modal-agregar-playlist',
  templateUrl: './modal-agregar-playlist.component.html',
  styleUrls: ['./modal-agregar-playlist.component.css']
})
export class ModalAgregarPlaylistComponent implements OnInit {
  playlists: any[] = [];
  usuario: any;
  mostrarFormCrear = false;
  crearPlaylistForm: FormGroup;
  playlistsSeleccionadas = new Set<number>();

  constructor(
    public dialogRef: MatDialogRef<ModalAgregarPlaylistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private playlistService: PlaylistService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.crearPlaylistForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      acceso: [true]
    });
  }

  ngOnInit() {
    this.authService.usuario$.subscribe(user => {
      this.usuario = user;
      console.log('Usuario en modal:', this.usuario);
      if (this.usuario && this.usuario.id) {
        this.cargarPlaylists();
      }
    });
    
    // Intentar mostrar usuario logueado si no está cargado
    if (!this.usuario) {
      this.authService.mostrarUserLogueado().subscribe(
        user => {
          this.usuario = user;
          console.log('Usuario obtenido:', this.usuario);
          if (this.usuario && this.usuario.id) {
            this.cargarPlaylists();
          }
        }
      );
    }
  }

  cargarPlaylists() {
    console.log('Cargando playlists para usuario ID:', this.usuario.id);
    this.playlistService.obtenerListasDeReproduccion(this.usuario.id).subscribe(
      res => {
        console.log('Respuesta del servidor:', res);
        const playlistsData = res.data?.playlists || res.playlists || [];
        this.playlists = playlistsData.map((playlist: any) => ({
          ...playlist,
          videos_count: playlist.videos?.length || 0
        }));
        console.log('Playlists cargadas:', this.playlists);
      },
      error => {
        console.error('Error al cargar playlists:', error);
        console.error('Detalle del error:', error.error);
        this.playlists = [];
      }
    );
  }

  togglePlaylist(playlistId: number) {
    if (this.playlistsSeleccionadas.has(playlistId)) {
      this.playlistsSeleccionadas.delete(playlistId);
    } else {
      this.playlistsSeleccionadas.add(playlistId);
    }
  }

  isPlaylistSeleccionada(playlistId: number): boolean {
    return this.playlistsSeleccionadas.has(playlistId);
  }

  toggleFormCrear() {
    this.mostrarFormCrear = !this.mostrarFormCrear;
    if (!this.mostrarFormCrear) {
      this.crearPlaylistForm.reset({ acceso: true });
    }
  }

  crearNuevaPlaylist() {
    if (this.crearPlaylistForm.valid) {
      const { nombre, acceso } = this.crearPlaylistForm.value;
      this.playlistService.crearLista(nombre, acceso, this.usuario.id).subscribe(
        res => {
          console.log('Playlist creada:', res);
          this.cargarPlaylists();
          this.toggleFormCrear();
          const newPlaylist = res.data?.playlist || res.playlist;
          if (newPlaylist && newPlaylist.id) {
            this.playlistsSeleccionadas.add(newPlaylist.id);
          }
        },
        error => {
          console.error('Error al crear playlist:', error);
        }
      );
    }
  }

  agregarVideos() {
    if (this.playlistsSeleccionadas.size === 0) {
      return;
    }

    const requests: any[] = [];
    const playlistNames: { [key: number]: string } = {};
    
    // Crear mapa de IDs a nombres de playlists
    this.playlists.forEach(playlist => {
      playlistNames[playlist.id] = playlist.nombre;
    });

    // Crear array de observables con manejo de errores
    this.playlistsSeleccionadas.forEach(playlistId => {
      const request = this.playlistService.agregarVideosALista(playlistId, this.data.videoIds).pipe(
        catchError(error => {
          return of({ error: true, playlistId, message: error.error?.message || 'Error desconocido' });
        })
      );
      requests.push(request);
    });

    // Ejecutar todas las peticiones en paralelo
    forkJoin(requests).subscribe(
      (results: any[]) => {
        const exitosos: string[] = [];
        const duplicados: string[] = [];
        const errores: string[] = [];

        results.forEach((result, index) => {
          const playlistId = Array.from(this.playlistsSeleccionadas)[index];
          const playlistName = playlistNames[playlistId];

          if (result.error) {
            if (result.message.includes('ya está en la playlist') || result.message.includes('ya existe')) {
              duplicados.push(playlistName);
            } else {
              errores.push(playlistName);
            }
          } else {
            exitosos.push(playlistName);
          }
        });

        // Mostrar mensajes según los resultados
        if (exitosos.length > 0) {
          this.snackBar.open(
            `Videos agregados exitosamente a: ${exitosos.join(', ')}`,
            'Cerrar',
            {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            }
          );
        }

        if (duplicados.length > 0) {
          this.snackBar.open(
            `${this.data.videoIds.length > 1 ? 'Algunos videos ya existen' : 'El video ya existe'} en: ${duplicados.join(', ')}`,
            'Cerrar',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['warning-snackbar']
            }
          );
        }

        if (errores.length > 0) {
          this.snackBar.open(
            `Error al agregar a: ${errores.join(', ')}`,
            'Cerrar',
            {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            }
          );
        }

        // Cerrar el diálogo con información del resultado
        this.dialogRef.close({
          success: exitosos.length > 0,
          count: exitosos.length,
          duplicados: duplicados.length,
          errores: errores.length
        });
      }
    );
  }

  cancelar() {
    this.dialogRef.close();
  }
}
