import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Se precisar fazer chamadas diretas, mas geralmente o UsuarioService faz
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../enviroments/environment.development';
import { UsuarioService } from '../services/usuario.service';

// Chaves para o localStorage
const TOKEN_KEY = 'plataforma-auth-token';
const USER_KEY = 'plataforma-auth-user';
const EXPIRATION_KEY = 'plataforma-auth-token-expiration';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private loginApiUrl = `${environment.apiUrl}/Usuarios/login`;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private http: HttpClient
  ) {
    const storedUser = localStorage.getItem(USER_KEY);
    this.currentUserSubject = new BehaviorSubject<any>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(credentials: { email: string; senha: string }): Observable<any> {
    return this.usuarioService.loginUsuario(credentials).pipe(
      tap((response) => {
        if (
          response &&
          response.token &&
          response.usuario &&
          response.expiration
        ) {
          this.setSession(response);
          this.currentUserSubject.next(response.usuario);
        } else {
          console.error('Resposta de login inválida do servidor:', response);
          throw new Error('Resposta de login inválida.');
        }
      }),
      catchError((error) => {
        console.error('AuthService: Erro durante o login', error);
        return throwError(() => error);
      })
    );
  }

  private setSession(authResult: {
    token: string;
    expiration: string;
    usuario: any;
  }): void {
    localStorage.setItem(TOKEN_KEY, authResult.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authResult.usuario));
    localStorage.setItem(EXPIRATION_KEY, authResult.expiration);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRATION_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    const expiration = localStorage.getItem(EXPIRATION_KEY);

    if (!token || !expiration) {
      return false;
    }

    try {
      const expirationDate = new Date(expiration);
      return expirationDate.getTime() > new Date().getTime();
    } catch (e) {
      console.error('Erro ao analisar data de expiração do token:', e);
      this.logout();
      return false;
    }
  }
}
