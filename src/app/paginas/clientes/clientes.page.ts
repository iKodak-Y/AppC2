import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonItem, IonItemSliding, IonList, IonButtons, IonBackButton, IonButton } from '@ionic/angular/standalone'; // Asegúrate de tener todas las necesarias
import { AlertController, LoadingController } from '@ionic/angular'; // Asegúrate de tener estas
import { ClientesService } from 'src/app/servicios/clientes.service';
import { GeneralService } from 'src/app/servicios/general.service';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, etc.
import { FormsModule } from '@angular/forms'; // Si usas ngModel
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [IonButton, IonBackButton, IonButtons, IonList, IonItemSliding, IonItem, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonContent, IonTitle, IonHeader, IonToolbar, CommonModule, FormsModule]
})
export class ClientesPage implements OnInit {

  listaClientes: any[] = [];
  // objetoRespuesta: any = {};
  // objCliente: any = {};

  constructor(
    private servC: ClientesService,
    private loading: LoadingController,
    public servG: GeneralService,
    private alert: AlertController,
  ) { }

  ngOnInit() {
    this.cargarClientes();
  }

  ionViewWillEnter() {
    this.cargarClientes();
  }
  async cargarClientes() {

    // VERIFICACIÓN CRUCIAL:
    console.log("[clientes.page.ts] Verificando this.servC:", this.servC);
    if (this.servC) {
      console.log("Verificando typeof this.servC.get_clientes:", typeof this.servC.get_clientes);
    } else {
      console.error("ERROR: this.servC es undefined o null!");
      this.servG.fun_Mensaje("Error crítico: Servicio de Clientes no inyectado.", "danger");
      return; // Detener ejecución si el servicio no existe
    }

    if (this.servC && typeof this.servC.get_clientes === 'function') {
      console.log("Llamando a this.servC.get_clientes()...");
      this.servC.get_clientes().subscribe({
        next: (respuesta: any) => {
          console.log("SUBSCRIBE NEXT: Respuesta recibida:", respuesta);
          if (respuesta && respuesta.data && respuesta.cant > 0) {
            this.listaClientes = respuesta.data.filter(
              (cliente: any) => cliente.cli_estado === 'A'
            );
            if (this.listaClientes.length === 0) {
              this.servG.fun_Mensaje("No hay clientes activos para mostrar.", "warning");
            }
          } else {
            this.listaClientes = [];
            this.servG.fun_Mensaje("No existen datos de clientes o la respuesta no es válida.", "warning");
          }
        },
        error: (err: Error) => {
          if (err && err.message) {
            this.servG.fun_Mensaje(`Error al cargar clientes: ${err.message}`, "danger");
          } else {
            this.servG.fun_Mensaje("Error desconocido al cargar clientes.", "danger");
          }
        },
        complete: () => {
          console.log("SUBSCRIBE COMPLETE");
        }
      });
    } else {
      console.error("ERROR: this.servC.get_clientes no es una función o servC no está definido.");
      this.servG.fun_Mensaje("Error crítico: Método get_clientes no encontrado.", "danger");
    }
  }

  fun_editar(id: number, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    console.log("Editar " + id)
    this.servG.irA('/cliente/' + id)
  }

  async fun_eliminar(cliente: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    // console.log("Eliminar " + id)
    let alert = await this.alert.create({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar el cliente [' + cliente.cli_nombre + ']?',
      buttons: [
        {
          text: 'Si',
          handler: async () => {
            let l = await this.loading.create({
              message: 'Borrando...'
            });
            l.present();
            //borrar
            this.servC.borrar_cliente(cliente.cli_id).subscribe(
              (respuesta) => {
                l.dismiss();
                this.servG.fun_Mensaje("Cliente eliminado correctamente");
                this.cargarClientes();
              }, (error) => {
                l.dismiss();
                this.servG.fun_Mensaje("Error al eliminar el cliente")
              }
            )
          }
        },
        {
          text: 'No',
          handler: () => { }
        }
      ]
    });
    alert.present();
  }

}