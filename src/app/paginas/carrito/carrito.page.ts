import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonLabel, IonButton, IonIcon, IonInput, IonItemDivider, IonRow, IonDatetimeButton, IonModal, IonDatetime, IonAlert, IonList, IonText } from '@ionic/angular/standalone';
import { GeneralService } from 'src/app/servicios/general.service';
import { ClientesService } from 'src/app/servicios/clientes.service';
import { PedidosService } from 'src/app/servicios/pedidos.service';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [IonList, IonDatetime, IonModal, IonDatetimeButton, IonRow, IonItemDivider, IonInput, IonIcon, IonButton, IonLabel, IonItem, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonText, CommonModule, FormsModule]
})
export class CarritoPage implements OnInit {
  public pedidos: any[] = [];
  public totalCarrito: number = 0;
  public cliente: any = null;
  public cli_identificacion: string = '';
  public fechaPedido: string = new Date().toISOString();
  public cantidades: { [key: string]: number } = {};

  constructor(
    public servG: GeneralService,
    private servC: ClientesService,
    private servP: PedidosService,
    private loading: LoadingController,
    private alert: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.obtenerPedidos();
  }

  obtenerPedidos() {
    this.pedidos = this.servG.obtenerPedidos();
    this.pedidos.forEach(pedido => {
      this.cantidades[pedido.prod_id] = 1; // Inicializar cantidad en 1 para cada producto
    });
    this.totalCarrito = this.servG.totalCarrito;
    this.calcularTotalConCantidades();
  }

  onInputChange(event: any) {
    this.cli_identificacion = event.target.value;
    this.buscarCliente(this.cli_identificacion);
  }

  buscarCliente(ci: any) {
    this.servC.getClientexci(ci).subscribe(
      (respuesta: any) => {
        if (respuesta && respuesta.cli_id) {
          this.cliente = respuesta;
          this.servG.fun_Mensaje("Cliente encontrado", "success");
          console.log("Cliente encontrado:", this.cliente);
        } else {
          this.servG.fun_Mensaje("Cliente no encontrado", "warning");
          this.cliente = null;
        }
      },
      (error) => {
        this.servG.fun_Mensaje("Error al buscar cliente", "danger");
        this.cliente = null;
      }
    );
  }

  calcularSubtotal(producto: any): number {
    const cantidad = this.cantidades[producto.prod_id] || 1;
    return cantidad * parseFloat(producto.prod_precio);
  }

  validarStock(producto: any, cantidad: number): boolean {
    if (cantidad > producto.prod_stock) {
      this.servG.fun_Mensaje(`Solo hay ${producto.prod_stock} unidades disponibles`, 'warning');
      this.cantidades[producto.prod_id] = producto.prod_stock;
      this.calcularTotalConCantidades();
      return false;
    }
    return true;
  }

  actualizarCantidad(producto: any, event: any) {
    const cantidad = parseInt(event.target.value) || 1;
    if (cantidad < 1) {
      this.cantidades[producto.prod_id] = 1;
    } else if (this.validarStock(producto, cantidad)) {
      this.cantidades[producto.prod_id] = cantidad;
    }
    this.calcularTotalConCantidades();
  }
  calcularTotalConCantidades() {
    this.totalCarrito = this.pedidos.reduce((total, producto) => {
      return total + (parseFloat(producto.prod_precio) * (this.cantidades[producto.prod_id] || 1));
    }, 0);
  }
  async procesarPedido() {
    console.log('Iniciando procesamiento de pedido');
    
    if (!this.cliente) {
      this.servG.fun_Mensaje('Por favor seleccione un cliente', 'warning');
      return;
    }

    if (this.pedidos.length === 0) {
      this.servG.fun_Mensaje('El carrito está vacío', 'warning');
      return;
    }

    const loading = await this.loading.create({
      message: 'Procesando pedido...'
    });
    await loading.present();

    try {
      // Formatear la fecha
      const fecha = new Date(this.fechaPedido);
      const fechaFormateada = fecha.toISOString().slice(0, 19).replace('T', ' ');
      console.log('Fecha formateada:', fechaFormateada);

      // Verificar que el cliente.cli_id sea un número válido
      const clienteId = Number(this.cliente.cli_id);
      if (isNaN(clienteId)) {
        throw new Error('ID de cliente inválido');
      }

      // Crear objeto pedido con valores numéricos validados
      const pedido = {
        cli_id: clienteId,
        ped_fecha: fechaFormateada,
        usr_id: 1,
        ped_estado: 0
      };
      console.log('Datos del pedido a enviar:', pedido);

      // Validar y crear detalles del pedido
      const detalles = this.pedidos.map(producto => {
        const cantidad = Number(this.cantidades[producto.prod_id]) || 1;
        const precio = Number(producto.prod_precio);
        const prodId = Number(producto.prod_id);

        if (isNaN(cantidad) || isNaN(precio) || isNaN(prodId)) {
          throw new Error('Datos de producto inválidos');
        }

        return {
          prod_id: prodId,
          det_cantidad: cantidad,
          det_precio: precio
        };
      });
      console.log('Detalles a enviar:', detalles);

      // Enviar pedido
      this.servP.crearPedidoCompleto(pedido, detalles).subscribe({
        next: (resultado) => {
          console.log('Resultado de crear pedido:', resultado);
          if (resultado && resultado.success) {
            // Limpiar el carrito
            this.servG.limpiarCarrito();
            this.pedidos = [];
            this.cantidades = {};
            this.totalCarrito = 0;
            this.cliente = null;
            this.cli_identificacion = '';
            
            loading.dismiss();
            this.servG.fun_Mensaje('Pedido creado exitosamente', 'success');
            this.router.navigate(['/catalogo']);
          } else {
            loading.dismiss();
            throw new Error('No se pudo crear el pedido completo');
          }
        },
        error: (error: any) => {
          console.error('Error detallado al procesar el pedido:', error);
          loading.dismiss();
          this.servG.fun_Mensaje(
            error.message || 'Error al crear el pedido',
            'danger'
          );
        }
      });
    } catch (error: any) {
      console.error('Error al procesar el pedido:', error);
      await loading.dismiss();
      this.servG.fun_Mensaje(
        error.message || 'Error al crear el pedido',
        'danger'
      );
    }
  }
  eliminarProducto(producto: any) {
    const index = this.pedidos.findIndex(p => p.prod_id === producto.prod_id);
    if (index > -1) {
      this.pedidos.splice(index, 1);
      delete this.cantidades[producto.prod_id];
      this.servG.pedidos = this.pedidos;
      this.servG.contadorPedidos = this.pedidos.length;
      this.calcularTotalConCantidades();
      this.servG.fun_Mensaje("Producto eliminado del carrito");
    }
  }

  async confirmarPedido() {
    if (!this.cliente) {
      this.servG.fun_Mensaje('Por favor seleccione un cliente', 'warning');
      return;
    }

    if (this.pedidos.length === 0) {
      this.servG.fun_Mensaje('El carrito está vacío', 'warning');
      return;
    }

    const loading = await this.loading.create({
      message: 'Procesando pedido...'
    });
    await loading.present();

    try {
      const fecha = new Date(this.fechaPedido);
      const fechaFormateada = fecha.toISOString().slice(0, 19).replace('T', ' ');      const pedido = {
        cli_id: Number(this.cliente.cli_id),
        ped_fecha: fechaFormateada,
        usr_id: 1, // Usuario por defecto
        ped_estado: 0 // 0 = pendiente
      };      const detalles = this.pedidos.map(producto => ({
        prod_id: Number(producto.prod_id),
        det_cantidad: Number(this.cantidades[producto.prod_id] || 1),
        det_precio: parseFloat(producto.prod_precio)
      }));

      const resultado = await this.servP.crearPedidoCompleto(pedido, detalles).toPromise();
      
      if (resultado && resultado.pedido) {
        this.servG.limpiarCarrito();
        this.pedidos = [];
        this.cantidades = {};
        this.totalCarrito = 0;
        this.cliente = null;
        this.cli_identificacion = '';
        
        await loading.dismiss();
        this.servG.fun_Mensaje('Pedido creado exitosamente', 'success');
        this.router.navigate(['/catalogo']);
      } else {
        throw new Error('No se pudo crear el pedido completo');
      }
    } catch (error: any) {
      console.error('Error al procesar el pedido:', error);
      await loading.dismiss();
      this.servG.fun_Mensaje(
        error.error?.message || error.message || 'Error al crear el pedido',
        'danger'
      );
    }
  }
}
