import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainLayoutComponent],
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {
  title = 'plataforma-oportunidades-ui';
}
