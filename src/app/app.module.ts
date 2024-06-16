import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { MainPageComponent } from './componentes/main-page/main-page.component';
import { HeaderComponent } from './componentes/header/header.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { RegistroComponent } from './componentes/registro/registro.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './componentes/home/home.component';
import { ParaprobarComponent } from './componentes/paraprobar/paraprobar.component';
import { CrearCanalComponent } from './componentes/crear-canal/crear-canal.component';
import { SubirVideoComponent } from './componentes/subir-video/subir-video.component';
import { CookieService } from 'ngx-cookie-service';
import { ChunkPipe } from './pipes/chunk.pipe';
import { MisvideosComponent } from './componentes/misvideos/misvideos.component';
import { EditarvideoComponent } from './componentes/editarvideo/editarvideo.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChunkPipe,
    MainPageComponent,
    HeaderComponent,
    RegistroComponent,
    HomeComponent,
    ParaprobarComponent,
    CrearCanalComponent,
    SubirVideoComponent,
    MisvideosComponent,
    EditarvideoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
