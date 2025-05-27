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
}