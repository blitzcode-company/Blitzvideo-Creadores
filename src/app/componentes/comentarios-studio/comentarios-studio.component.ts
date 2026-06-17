import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ComentariosService } from '../../servicios/comentarios.service';

interface ComentarioNodo {
  id: number;
  usuario_id: number;
  mensaje: string;
  created_at: string;
  likedByUser: boolean;
  meGustaId: number | null;
  contadorDeLikes: number;
  puedeBorrar: boolean;
  user: { id: number; name: string; foto: string };
  respuesta_id: number | null;
  hijos: ComentarioNodo[];
  expandido: boolean;
  respondiendo: boolean;
  textoRespuesta: string; 
}


@Component({
  selector: 'app-comentarios-studio',
  templateUrl: './comentarios-studio.component.html',
  styleUrl: './comentarios-studio.component.css'
})
export class ComentariosStudioComponent {
  @Input() videoId!: number;
  @Input() usuarioId!: number;
  @Input() usuarioFoto: string = '';


  comentarios: ComentarioNodo[] = [];
  cargando = true;
  totalComentarios = 0;

  constructor(
    private comentariosService: ComentariosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.cargando = true;
    this.comentariosService.obtenerComentarios(this.videoId, this.usuarioId).subscribe({
      next: (res) => {
        this.comentarios = this.construirArbol(res);
        this.totalComentarios = res.length;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => { this.cargando = false; }
    });
  }

  private construirArbol(planos: any[]): ComentarioNodo[] {
    const mapa = new Map<number, ComentarioNodo>();

    // primero crear todos los nodos
    planos.forEach(c => {
      mapa.set(c.id, { ...c, hijos: [], expandido: false, respondiendo: false, textoRespuesta: '' });
    });

    const raices: ComentarioNodo[] = [];

    // después asignar hijos
    mapa.forEach(nodo => {
      if (nodo.respuesta_id && mapa.has(nodo.respuesta_id)) {
        mapa.get(nodo.respuesta_id)!.hijos.push(nodo);
      } else if (!nodo.respuesta_id) {
        raices.push(nodo);
      }
    });

    // ordenar raices y hijos por fecha desc
    raices.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    mapa.forEach(n => n.hijos.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));

    return raices;
  }

  toggleLike(comentario: ComentarioNodo): void {
    if (comentario.likedByUser && comentario.meGustaId) {
      this.comentariosService.quitarMeGusta(comentario.meGustaId, this.usuarioId).subscribe({
        next: () => {
          comentario.likedByUser = false;
          comentario.meGustaId = null;
          comentario.contadorDeLikes--;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.comentariosService.darMeGusta(comentario.id, this.usuarioId).subscribe({
        next: (res) => {
          comentario.likedByUser = true;
          comentario.meGustaId = res.meGustaId;
          comentario.contadorDeLikes++;
          this.cdr.markForCheck();
        }
      });
    }
  }

responder(comentario: ComentarioNodo): void {
  if (!comentario.textoRespuesta?.trim()) return;

  this.comentariosService.responderComentario(
    comentario.id,
    this.usuarioId,
    comentario.textoRespuesta.trim()
  ).subscribe({
    next: (res) => {
      // agregar la nueva respuesta al árbol localmente
      const nueva: ComentarioNodo = {
        ...res,
        hijos: [],
        expandido: false,
        respondiendo: false,
        textoRespuesta: '',
        puedeBorrar: true,
        likedByUser: false,
        meGustaId: null,
        contadorDeLikes: 0,
        user: { id: this.usuarioId, name: 'Tú', foto: this.usuarioFoto }
      };

      comentario.hijos.push(nueva);
      comentario.expandido = true;
      this.cancelarRespuesta(comentario);
      this.totalComentarios++;
      this.cdr.markForCheck();
    }
  });
}

cancelarRespuesta(comentario: ComentarioNodo): void {
  comentario.respondiendo = false;
  comentario.textoRespuesta = '';
}

  eliminar(comentario: ComentarioNodo, padre?: ComentarioNodo): void {
    if (!confirm('¿Eliminar este comentario?')) return;

    this.comentariosService.eliminarComentario(comentario.id, this.usuarioId).subscribe({
      next: () => {
        if (padre) {
          padre.hijos = padre.hijos.filter(h => h.id !== comentario.id);
        } else {
          this.comentarios = this.comentarios.filter(c => c.id !== comentario.id);
        }
        this.totalComentarios--;
        this.cdr.markForCheck();
      }
    });
  }

  toggleRespuestas(comentario: ComentarioNodo): void {
    comentario.expandido = !comentario.expandido;
  }

  formatearFecha(fecha: string): string {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/user.png';
  }

}
