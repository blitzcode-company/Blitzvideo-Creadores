import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './componentes/main-page/main-page.component';
import { LoginComponent } from './componentes/login/login.component';
import { autenticacionGuard } from './guards/autenticacion.guard';
import { RegistroComponent } from './componentes/registro/registro.component';
import { HomeComponent } from './componentes/home/home.component';
import { ParaprobarComponent } from './componentes/paraprobar/paraprobar.component';
import { CrearCanalComponent } from './componentes/crear-canal/crear-canal.component';
import { SubirVideoComponent } from './componentes/subir-video/subir-video.component';
import { MisvideosComponent } from './componentes/misvideos/misvideos.component';
import { EditarvideoComponent } from './componentes/editarvideo/editarvideo.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'prueba', component: ParaprobarComponent},
  { path: 'crearCanal', component: CrearCanalComponent},
  { path: 'subirVideo', component: SubirVideoComponent},
  { path: 'misVideos', component: MisvideosComponent},
  { path: 'editarVideo/:id', component: EditarvideoComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
