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
    RegistroComponent,
    SubirVideoComponent,
    ChunkPipe,
    ModalEliminarVideoComponent,
    NoEncontradoComponent,
    CrearStreamComponent,
    ModalConfirmacionStreamComponent,
    MonitorearStreamComponent,
    TiempoPipe,
    
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
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [
    CookieService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
