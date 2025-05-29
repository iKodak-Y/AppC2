import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonGrid, IonRow, IonCol, IonSearchbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { LoadingController } from '@ionic/angular'
import { CatalogoService } from 'src/app/servicios/catalogo.service';
import { GeneralService } from 'src/app/servicios/general.service';
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonSearchbar, IonCol, IonRow, IonGrid, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonList, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, IonContent, CommonModule, FormsModule]
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
    this.servC.get_productos().subscribe(
      (respuesta: any) => {
        this.objetoRespuesta = respuesta;
        if (this.objetoRespuesta.cant > 0) {
          this.listaProductos = this.objetoRespuesta.data;
          console.log(this.listaProductos);
        } else {
          this.servG.fun_Mensaje("No existen datos")
        }
      }, (error: any) => {
        this.servG.fun_Mensaje("Error al recuperar los clientes")
      }
    )
  }

  abrirCarrito() {
    this.servG.irA('/carrito');
  }
}
