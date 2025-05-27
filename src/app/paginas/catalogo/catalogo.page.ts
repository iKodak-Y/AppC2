import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { LoadingController } from '@ionic/angular'
import { CatalogoService } from 'src/app/servicios/catalogo.service';
import { GeneralService } from 'src/app/servicios/general.service';
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonList, IonBackButton, IonButtons,  IonHeader, IonTitle, IonToolbar, IonContent, CommonModule, FormsModule]
})
export class CatalogoPage implements OnInit {
  objetoRespuesta: any = {};
  listaProductos: any[] = [];

  constructor(
    private servC: CatalogoService,
    private loading: LoadingController,
    public servG: GeneralService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.cargarProductos();
  }

  async cargarProductos() {

    let l = await this.loading.create();
    l.present();

    this.servC.get_productos().subscribe(
      (respuesta: any) => {
        this.objetoRespuesta = respuesta;
        if (this.objetoRespuesta.cant > 0) {
          this.listaProductos = this.objetoRespuesta.data;
          console.log(this.listaProductos);
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
}
