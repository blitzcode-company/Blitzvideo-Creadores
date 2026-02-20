import { Component } from '@angular/core';
import { ThemeService } from './servicios/theme.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Blitzvideo-Creadores';
   constructor(private themeService: ThemeService, private cookieService: CookieService) {
  }


  ngOnInit(): void {
    const theme = this.cookieService.get('tema') || 'auto';
  }
 
}
