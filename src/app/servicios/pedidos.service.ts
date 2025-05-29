import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { GeneralService } from './general.service';

@Injectable({
    providedIn: 'root'
})
export class PedidosService {
    constructor(
        private http: HttpClient,
        private servG: GeneralService
    ) { }

    private validateNumber(value: any): number {
        const num = Number(value);
        if (isNaN(num)) {
            throw new Error(`Valor inválido: ${value} no es un número`);
        }
        return num;
    }

    private handleError(error: any) {
        console.error('An error occurred:', error);
        return throwError(() => new Error(error.error?.message || 'Error en la operación'));
    }

    crearPedido(pedido: any): Observable<any> {
        // Validar y convertir datos numéricos
        try {
            const pedidoValidado = {
                cli_id: this.validateNumber(pedido.cli_id),
                ped_fecha: pedido.ped_fecha,
                usr_id: this.validateNumber(pedido.usr_id),
                ped_estado: this.validateNumber(pedido.ped_estado)
            };
            console.log('Creando pedido (validado):', pedidoValidado);

            const headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this.http.post<any>(`${this.servG.URLSERV}pedidos`, pedidoValidado, { headers }).pipe(
                map(response => {
                    console.log('Respuesta crear pedido:', response);
                    if (response && response.id) {
                        return { ped_id: response.id };
                    }
                    return response;
                }),
                catchError(error => {
                    console.error('Error en crearPedido:', error);
                    return throwError(() => new Error(error.error?.message || 'Error al crear el pedido'));
                })
            );
        } catch (error) {
            return throwError(() => error);
        }
    }

    crearPedidoDetalle(detalle: any): Observable<any> {
        try {
            // Validar y convertir datos numéricos
            const detalleValidado = {
                prod_id: this.validateNumber(detalle.prod_id),
                ped_id: this.validateNumber(detalle.ped_id),
                det_cantidad: this.validateNumber(detalle.det_cantidad),
                det_precio: this.validateNumber(detalle.det_precio)
            };
            console.log('Creando detalle de pedido (validado):', detalleValidado);

            const headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this.http.post<any>(`${this.servG.URLSERV}pedidosdetalle`, detalleValidado, { headers }).pipe(
                map(response => {
                    console.log('Respuesta crear detalle:', response);
                    if (response && response.id) {
                        return { det_id: response.id };
                    }
                    return response;
                }),
                catchError(error => {
                    console.error('Error en crearPedidoDetalle:', error);
                    return throwError(() => new Error(error.error?.message || 'Error al crear el detalle'));
                })
            );
        } catch (error) {
            return throwError(() => error);
        }
    }

    crearPedidoCompleto(pedido: any, detalles: any[]): Observable<any> {
        return this.crearPedido(pedido).pipe(
            switchMap(resultPedido => {
                console.log('Pedido creado:', resultPedido);
                const pedidoId = this.validateNumber(resultPedido.ped_id);

                const detallesWithPedidoId = detalles.map(detalle => ({
                    ...detalle,
                    ped_id: pedidoId
                }));

                const detallesObservables = detallesWithPedidoId.map(detalle =>
                    this.crearPedidoDetalle(detalle)
                );

                return from(Promise.all(detallesObservables.map(obs =>
                    obs.toPromise()
                ))).pipe(
                    map(detallesResults => {
                        console.log('Detalles creados:', detallesResults);
                        return {
                            success: true,
                            pedido: resultPedido,
                            detalles: detallesResults
                        };
                    })
                );
            }),
            catchError(error => {
                console.error('Error al crear pedido completo:', error);
                return throwError(() => error);
            })
        );
    }
}
