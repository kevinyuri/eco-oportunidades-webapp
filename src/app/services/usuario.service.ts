import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../enviroments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrlBase = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Envia os dados de registo para o endpoint /registrar do backend.
   * @param usuarioData Os dados do utilizador para registo.
   * @returns Observable com a resposta do backend.
   */
  registrarUsuario(usuarioData: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrlBase}/Usuarios/registrar`, usuarioData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Envia as credenciais de login para o endpoint /login do backend.
   * @param credentials As credenciais do utilizador (email e senha).
   * @returns Observable com a resposta do backend (espera-se token, expiração e dados do utilizador).
   */
  loginUsuario(credentials: { email: string; senha: string }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrlBase}/Usuarios/login`, credentials)
      .pipe(catchError(this.handleError));
  }

  /**
   * Manipulador de erros para chamadas HTTP.
   * Tenta extrair uma mensagem de erro útil da resposta do backend.
   * @param error A HttpErrorResponse recebida.
   * @returns Um Observable que emite um Erro com a mensagem formatada.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage =
      'Ocorreu um erro desconhecido ao processar a sua solicitação!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro de cliente: ${error.error.message}`;
    } else {
      console.error(
        `Backend retornou código ${error.status}, ` +
          `corpo do erro era: ${JSON.stringify(error.error)}`
      );

      if (error.status === 400) {
        if (error.error && error.error.errors) {
          const validationErrors = error.error.errors;
          let messages = [];
          for (const key in validationErrors) {
            if (validationErrors.hasOwnProperty(key)) {
              messages.push(validationErrors[key].join(' '));
            }
          }
          errorMessage = `Erro de validação: ${messages.join(' ')}`;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (
          typeof error.error === 'string' &&
          error.error.length < 200
        ) {
          errorMessage = error.error;
        } else {
          errorMessage = `Erro ${error.status}: Solicitação inválida. Verifique os dados enviados.`;
        }
      } else if (error.status === 401 && error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = 'Credenciais inválidas ou não autorizado.';
      } else if (error.status === 500 && error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 500) {
        errorMessage =
          'Erro interno do servidor. Por favor, tente novamente mais tarde.';
      } else if (error.message) {
        errorMessage = error.message;
      }
    }
    console.error(
      'Erro detectado pelo handleError:',
      error,
      'Mensagem formatada para o utilizador:',
      errorMessage
    );
    return throwError(() => new Error(errorMessage));
  }
}
