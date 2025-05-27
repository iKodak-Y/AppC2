import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonItem, IonItemSliding, IonList, IonButtons, IonBackButton, IonButton } from '@ionic/angular/standalone';
import { AlertController, LoadingController } from '@ionic/angular'
import { ClientesService } from 'src/app/servicios/clientes.service';
import { GeneralService } from 'src/app/servicios/general.service';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [IonButton, IonBackButton, IonButtons, IonList, IonItemSliding, IonItem, IonIcon, IonItemOption, IonItemOptions, IonLabel,  IonContent, IonTitle, IonHeader, IonToolbar, CommonModule, FormsModule]
})
export class ClientesPage implements OnInit {

  listaClientes: any[] = [];
  objetoRespuesta: any = {};
  objCliente: any = {};

  constructor(
    private servC: ClientesService,
    private loading: LoadingController,
    public servG: GeneralService,
    private alert: AlertController,
  ) { }

  ngOnInit() {
    this.cargarClientes();
    console.log(this.servC.get_clientes());
  }

  ionViewWillEnter() {
    this.cargarClientes();
  }
  //modificar para que solo muestre los clientes con estado Activo
  async cargarClientes() {

    let l = await this.loading.create();
    l.present();

    this.servC.get_clientes().subscribe(
      (respuesta: any) => {

        this.objetoRespuesta = respuesta;

        if (this.objetoRespuesta.cant > 0) {
          this.listaClientes = this.objetoRespuesta.data.filter( // filtro para mostrar solo los clientes activos cli_estado = 'A'
            (cliente: any) => cliente.cli_estado === 'A'
          )
          console.log(this.listaClientes);
          l.dismiss();
        } else {
          this.servG.fun_Mensaje("No existen datos")
        }


      }, (error: any) => {
        l.dismiss();
        this.servG.fun_Mensaje("Error al recuperar los clientes")
      }
    )
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