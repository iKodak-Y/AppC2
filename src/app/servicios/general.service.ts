import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  public proceso: number = 1;
  private baseUrl = 'https://api-app-7tty.onrender.com';
  public URLSERV: string;
  public pedidos: any[] = [];
  public contadorPedidos: number = 0;
  public totalCarrito: number = 0;

  constructor(private router: Router, private toast: ToastController) {
    // Asegúrate de que la URL siempre termine con /api/
    this.URLSERV = `${this.baseUrl}/api/`;
    console.log('GeneralService - URLSERV:', this.URLSERV);
  }

  //funciones generales
  irA(url: string) {
    console.log('--- Intentando navegar a:', url);
    this.router.navigateByUrl(url);
  }

  //funcion emite mensaje
  async fun_Mensaje(texto: string, tipo: string = 'success') {
    let t = await this.toast.create({
      message: texto,
      color: tipo,
      duration: 3000
    });
    t.present();
  }

  imagenUrl(urlimagen: any) {
    let url = this.baseUrl + urlimagen;
    return url;
  }

  agregarProducto(producto: any) {
    this.pedidos.push(producto);
    this.contadorPedidos = this.pedidos.length;
    this.calcularTotal();
    console.log('Producto agregado:', producto);
    console.log('Total de pedidos:', this.contadorPedidos);
    console.log('Total del carrito: $', this.totalCarrito);
    this.fun_Mensaje('Producto agregado correctamente');
  }
  calcularTotal() {
    this.totalCarrito = this.pedidos.reduce((total, producto) => {
      return total + parseFloat(producto.prod_precio);
    }, 0);
  }

  limpiarCarrito() {
    this.pedidos = [];
    this.contadorPedidos = 0;
    this.totalCarrito = 0;
  }

  obtenerContadorPedidos(): number {
    return this.contadorPedidos;
  }

  obtenerPedidos(): any[] {
    return this.pedidos;
  }

  limpiarPedidos() {
    this.pedidos = [];
    this.contadorPedidos = 0;
  }
}