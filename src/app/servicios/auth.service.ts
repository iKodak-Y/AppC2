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

    // Configuración de encabezados para asegurar que se envíe como JSON
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    console.log('URL:', url, 'Datos:', credentials);

    return this.http.post(url, credentials, httpOptions)
      .pipe(
        tap(response => console.log('Respuesta del servidor:', response)),
        catchError(error => {
          console.error('Error en la solicitud:', error);
          return throwError(error);
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