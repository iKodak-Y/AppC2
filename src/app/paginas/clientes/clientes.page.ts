import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from '@ionic/angular/standalone';
import { AlertController, LoadingController } from '@ionic/angular'
import { ClientesService } from 'src/app/servicios/clientes.service';
import { GeneralService } from 'src/app/servicios/general.service';
import { AuthService } from './../../servicios/auth.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, IonList, IonIcon, IonButton, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ClientesPage implements OnInit {

  listaClientes: any[] = [];
  objetoRespuesta: any = {};
  objCliente: any = {};

  constructor(
    private servC: ClientesService,
    private loading: LoadingController,
    public servG: GeneralService,
    private auth: AuthService,
    private http: HttpClient,
    private alert: AlertController,
  ) { }

  ngOnInit() {
    this.cargarClientes();
    console.log(this.servC.get_clientes());
    console.log('URLSERV:', this.servG.URLSERV);

  }

  ionViewWillEnter() {
    this.cargarClientes();
  }
  //modificar para que solo muestre los clientes con estado Activo
  async cargarClientes() {

    this.servC.get_clientes().subscribe(
      (respuesta: any) => {

        this.objetoRespuesta = respuesta;

        if (this.objetoRespuesta.cant > 0) {
          this.listaClientes = this.objetoRespuesta.data.filter( // filtro para mostrar solo los clientes activos cli_estado = 'A'
            (cliente: any) => cliente.cli_estado === 'A'
          )
          console.log(this.listaClientes);
        } else {
          this.servG.fun_Mensaje("No existen datos")
        }


      }, (error: any) => {
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