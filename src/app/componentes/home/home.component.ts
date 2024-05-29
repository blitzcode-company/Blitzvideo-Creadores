import { Component } from '@angular/core';
import { VideosService } from '../../servicios/videos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(videoService:VideosService, ){}
  

}
