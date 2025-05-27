import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeneralService } from './general.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string = '';

  constructor(private http: HttpClient, private servG: GeneralService) { }

  login(credentials: { usr_usuario: string; usr_clave: string }): Observable<any> {
    const url = `${this.servG.URLSERV}login`;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    console.log('URL:', url, 'Datos:', credentials);

    return this.http.post(url, credentials, httpOptions)
      .pipe(
        tap(response => {
          console.log('AUTH.SERVICE TAP: Respuesta del servidor:', response);
          // Intenta lanzar un error aquí para ver si es lo que se propaga
          // if (response) throw new Error("Error artificial después del tap");
        }),
        catchError(error => {
          console.error('AUTH.SERVICE CATCHERROR: Error en la solicitud:', error);
          console.error('AUTH.SERVICE CATCHERROR: Error status:', error.status);
          console.error('AUTH.SERVICE CATCHERROR: Error message:', error.message);
          // Re-lanza el error de una manera clara
          return throwError(() => new Error(error.message || 'Error desconocido en auth.service'));
        })
      );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token); // Guarda el token en localStorage
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  logout() {
    this.token = '';
    localStorage.removeItem('token');
  }
}