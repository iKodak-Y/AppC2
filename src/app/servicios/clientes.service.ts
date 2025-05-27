import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeneralService } from './general.service';
import { AuthService } from './auth.service';
import { catchError, tap, throwError, of } from 'rxjs'; // Asegúrate de importar 'of'
import { Observable } from 'rxjs'; // Asegúrate de importar Observable

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor(
    private servG: GeneralService,
    private http: HttpClient,
    private auth: AuthService
  ) {
    console.log('[clientes.service.ts] CONSTRUCTOR ClientesService Ejecutado'); // LOG VITAL
  }

  get_clientes(): Observable<any> { // Especificar el tipo de retorno Observable<any>
     console.log('[clientes.service.ts] Entrando a get_clientes()');

    const url = `${this.servG.URLSERV}cliente`;
    const token = this.auth.getToken();

    console.log('[clientes.service.ts] Token obtenido:', token); // LOG #2

    if (!token) {
      console.error('[clientes.service.ts] Token NO disponible. No se realizará la petición HTTP.');
      // Devolver un Observable que emite un error claro
      return throwError(() => new Error('Token no disponible para obtener clientes.'));
      // O si prefieres que la página maneje un array vacío:
      // return of({ cant: 0, data: [] }); // Asegúrate que la página maneje esto
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('[clientes.service.ts] Preparado para realizar petición HTTP GET a:', url); // LOG #3

    return this.http.get<any>(url, { headers }).pipe(
      tap(response => {
        console.log('[clientes.service.ts] TAP: Respuesta de get_clientes:', response); // LOG #4
      }),
      catchError(error => {
        console.error('[clientes.service.ts] CATCHERROR: Error en la petición get_clientes:', error); // LOG #5
        let errorMsg = 'Error desconocido al obtener clientes.';
        if (error && error.message) {
          errorMsg = error.message;
        } else if (error && error.status) {
          errorMsg = `Error ${error.status} - ${error.statusText || 'Error del servidor'}`;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }
  getClientexid(id: number) {
    let url = this.servG.URLSERV + 'cliente/' + id;
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