import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-no-encontrado',
  templateUrl: './no-encontrado.component.html',
  styleUrl: './no-encontrado.component.css'
})
export class NoEncontradoComponent {
  serverIp = environment.serverIp

}
