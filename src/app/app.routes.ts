import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth/auth.guard';
import { RegistroComponent } from './pages/registro/registro.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent, title: 'Login' },
      {
        path: 'registro',
        component: RegistroComponent,
        title: 'Registar Utilizador',
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'vagas',
        pathMatch: 'full',
      },
      {
        path: 'vagas',
        loadComponent: () =>
          import('./pages/vagas/vagas-list/vagas-list.component').then(
            (c) => c.VagasListComponent
          ),
        title: 'Vagas de Emprego',
      },
      {
        path: 'registro',
        component: RegistroComponent,
        title: 'Registar Utilizador',
      },
      {
        path: 'cursos',
        loadComponent: () =>
          import('./pages/cursos/cursos-list/cursos-list.component').then(
            (c) => c.CursosListComponent
          ),
        title: 'Cursos de Capacitação',
      },
    ],
  },

  { path: '**', redirectTo: '/login' },
];
