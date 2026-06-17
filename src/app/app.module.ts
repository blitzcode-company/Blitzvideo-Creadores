import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CrearCanalComponent } from './componentes/crear-canal/crear-canal.component';
import { EditarvideoComponent } from './componentes/editarvideo/editarvideo.component';
import { HeaderComponent } from './componentes/header/header.component';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { MainPageComponent } from './componentes/main-page/main-page.component';
import { MisvideosComponent } from './componentes/misvideos/misvideos.component';
import { SidebarCreadorComponent } from './componentes/sidebar-creador/sidebar-creador.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { SubirVideoComponent } from './componentes/subir-video/subir-video.component';
import { ChunkPipe } from './pipes/chunk.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ModalEliminarVideoComponent } from './componentes/modal-eliminar-video/modal-eliminar-video.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NoEncontradoComponent } from './componentes/no-encontrado/no-encontrado.component';
import { MatSelectModule } from '@angular/material/select'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrearStreamComponent } from './componentes/crear-stream/crear-stream.component';
import { ModalConfirmacionStreamComponent } from './componentes/modal-confirmacion-stream/modal-confirmacion-stream.component';
import { MonitorearStreamComponent } from './componentes/monitorear-stream/monitorear-stream.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TiempoPipe } from './pipes/tiempo.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { ModalAgregarPlaylistComponent } from './componentes/modal-agregar-playlist/modal-agregar-playlist.component';
import { EstadisticasComponent } from './componentes/estadisticas/estadisticas.component';
import { EstadisticasVideoComponent } from './componentes/estadisticas-video/estadisticas-video.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfirmarDialogoComponent } from './componentes/confirmar-dialogo/confirmar-dialogo.component';
import { ReproductorStreamComponent } from './componentes/reproductor-stream/reproductor-stream.component';
import { ComentariosStudioComponent } from './componentes/comentarios-studio/comentarios-studio.component';
import { ModalEditarStreamComponent } from './componentes/modal-editar-stream/modal-editar-stream.component';

@NgModule({
  declarations: [
    AppComponent,
    CrearCanalComponent,
    EditarvideoComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    MainPageComponent,
    MisvideosComponent,
    SidebarCreadorComponent,
    RegistroComponent,
    SubirVideoComponent,
    ChunkPipe,
    ModalEliminarVideoComponent,
    ModalAgregarPlaylistComponent,
    NoEncontradoComponent,
    CrearStreamComponent,
    ModalConfirmacionStreamComponent,
    MonitorearStreamComponent,
    TiempoPipe,
    EstadisticasComponent,
    EstadisticasVideoComponent,
    ConfirmarDialogoComponent,
    ReproductorStreamComponent,
    ComentariosStudioComponent,
    ModalEditarStreamComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSelectModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatRadioModule,
    MatSnackBarModule,
    FontAwesomeModule,

  ],
  exports: [
    SidebarCreadorComponent,
  ],
  providers: [
    CookieService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
