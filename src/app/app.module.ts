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
    ModalEliminarVideoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    MatDialogModule
  ],
  providers: [
    CookieService,
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
