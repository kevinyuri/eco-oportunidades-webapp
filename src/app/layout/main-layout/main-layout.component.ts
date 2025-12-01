import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToolbarModule,
    ButtonModule,
    AvatarModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  currentUser: any = null; // Pode ser uma interface User
  private userSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }

  irParaPerfil(): void {
    console.log('Navegar para o perfil do utilizador');
  }

  get isPerfilEmpresa(): boolean {
    return this.currentUser && this.currentUser.perfil === 'empresa';
  }
}
