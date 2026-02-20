import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { CrearCanalComponent } from './componentes/crear-canal/crear-canal.component';
import { SubirVideoComponent } from './componentes/subir-video/subir-video.component';
import { MisvideosComponent } from './componentes/misvideos/misvideos.component';
import { EditarvideoComponent } from './componentes/editarvideo/editarvideo.component';
import { NoEncontradoComponent } from './componentes/no-encontrado/no-encontrado.component';
import { autenticacionGuard } from './guards/autenticacion.guard';
import { CrearStreamComponent } from './componentes/crear-stream/crear-stream.component';
import { MonitorearStreamComponent } from './componentes/monitorear-stream/monitorear-stream.component';
import { EstadisticasComponent } from './componentes/estadisticas/estadisticas.component';
import { EstadisticasVideoComponent } from './componentes/estadisticas-video/estadisticas-video.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [autenticacionGuard]},
  { path: 'crearCanal', component: CrearCanalComponent, canActivate: [autenticacionGuard]},
  { path: 'crearStream', component: CrearStreamComponent, canActivate: [autenticacionGuard]},
  { path: 'subirVideo', component: SubirVideoComponent, canActivate: [autenticacionGuard]},
  { path: 'misVideos', component: MisvideosComponent, canActivate: [autenticacionGuard]},
  { path: 'estadisticas', component: EstadisticasComponent, canActivate: [autenticacionGuard]},
  { path: 'estadisticas-video/:videoId', component: EstadisticasVideoComponent, canActivate: [autenticacionGuard]},
  { path: 'monitorear-stream/:id', component: MonitorearStreamComponent, canActivate: [autenticacionGuard]},
  { path: 'editarVideo/:id', component: EditarvideoComponent, canActivate: [autenticacionGuard]},
  { path: '**', component: NoEncontradoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
