import { Canal } from "./canal"
import { Usuario } from "./usuario"
import { Videos } from "./videos";


export class Streams {

  id: number;
  stream_programado: any;
  max_viewers: number;
  total_viewers: number;
  activo: boolean;
  url_hls: string | null;
  viewers: number;
  video: Videos;
  canal: Canal;

  constructor(data?: any) {
    this.id = data?.id ?? 0;
    this.stream_programado = data?.stream_programado ?? null;
    this.max_viewers = data?.max_viewers ?? 0;
    this.total_viewers = data?.total_viewers ?? 0;
    this.activo = data?.activo ?? false;
    this.url_hls = data?.url_hls ?? null;
    this.viewers = data?.viewers ?? 0;

    this.video = new Videos(data?.video);
    this.canal = new Canal(data?.canal);
  }



}
