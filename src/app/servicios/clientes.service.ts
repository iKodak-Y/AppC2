import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeneralService } from './general.service';
import { AuthService } from './auth.service';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor(
    private servG: GeneralService,
    private http: HttpClient,
    private auth: AuthService
  ) { }

  get_clientes() {
    const url = `${this.servG.URLSERV}cliente`;
    const token = this.auth.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('Realizando petición a:', url);

    return this.http.get<any>(url, { headers }).pipe(
      tap(response => console.log('Respuesta:', response)),
      catchError(error => {
        console.error('Error en la petición:', error);
        return throwError(() => error);
      })
    );
  }
  getClientexid(id: number) {
    let url = this.servG.URLSERV + 'cliente/' + id;
    return this.http.get<any>(url);
  }

  getClientexci(ci: number) {
    let url = this.servG.URLSERV + 'cliente/ci/' + ci;
    return this.http.get<any>(url);
  }

  grabar_cliente(objCliente: any) {
    if (objCliente.cli_id > 0) {
      //update
      let url = this.servG.URLSERV + 'cliente/' + objCliente.cli_id;
      return this.http.put<any>(url, objCliente);
    } else {
      //insert
      let url = this.servG.URLSERV + 'cliente/';
      return this.http.post<any>(url, objCliente);

    }
  }

  borrar_cliente(id: number) {
    let url = this.servG.URLSERV + 'cliente/' + id;
    // return this.http.delete<any>(url)
    // cambiar el estado a inactivo en vez de borrar
    return this.http.patch<any>(url, { cli_estado: 'I' });
  }

}