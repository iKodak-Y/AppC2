import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, IonItemSliding } from '@ionic/angular'
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonLabel, IonInput, IonItem, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from 'src/app/servicios/clientes.service';
import { GeneralService } from 'src/app/servicios/general.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
  standalone: true,
  imports: [IonItem, IonInput, IonLabel, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})
export class ClientePage implements OnInit {
  id: number = 0;
  objCliente: any = {

    cli_id: 0,
    cli_identificacion: "",
    cli_nombre: "",
    cli_telefono: "",
    cli_correo: "",
    cli_direccion: "",
    cli_pais: "",
    cli_ciudad: ""

  }
  constructor(
    private route: ActivatedRoute,
    private servCli: ClientesService,
    private loading: LoadingController,
    public servG: GeneralService
  ) {
    this.id = this.route.snapshot.params["id"] ? this.route.snapshot.params["id"] : 0
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.id > 0) {
      //recuperar los datos del cliente con el id
      this.servCli.getClientexid(this.id).subscribe(
        (respuesta: any) => {
          this.objCliente = respuesta;
          console.log(this.objCliente);

        }
      )


    } else {
      console.log("Nuevo Cliente")
    }
  }


  async fun_grabar() {
    console.log("Grabar")
    if (this.objCliente.cli_identificacion == '') {
      this.servG.fun_Mensaje("Ingrese la identificación")
    } else {
      let l = await this.loading.create();
      l.present();
      await this.servCli.grabar_cliente(this.objCliente).subscribe(
        (respuesta) => {
          // console.log(JSON.stringify(respuesta));
          l.dismiss();
          this.servG.fun_Mensaje("Cliente grabado correctamente")
          if (respuesta.cli_id > 0) {
            this.servG.irA('/clientes');
          }
        }, (error) => {
          l.dismiss();
          this.servG.fun_Mensaje("Error al grabar el cliente");
        }
      )
    }
  }


}