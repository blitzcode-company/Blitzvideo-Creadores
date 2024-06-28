import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { CrearCanalComponent } from './componentes/crear-canal/crear-canal.component';
import { SubirVideoComponent } from './componentes/subir-video/subir-video.component';
import { MisvideosComponent } from './componentes/misvideos/misvideos.component';
import { EditarvideoComponent } from './componentes/editarvideo/editarvideo.component';



const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'crearCanal', component: CrearCanalComponent},
  { path: 'subirVideo', component: SubirVideoComponent},
  { path: 'misVideos', component: MisvideosComponent},
  { path: 'editarVideo/:id', component: EditarvideoComponent}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
