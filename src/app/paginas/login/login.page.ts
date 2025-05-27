import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonInput, IonCardTitle, IonCard, IonCardHeader, IonCardContent } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/servicios/auth.service';
import { GeneralService } from 'src/app/servicios/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardHeader, IonCard, IonCardTitle, IonInput, IonButton, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  credentials = { usr_usuario: '', usr_clave: '' };

  constructor(private auth: AuthService, private servG: GeneralService, private router: Router) { }

  ngOnInit() { }

  async onLogin() {
    if (!this.credentials.usr_usuario || !this.credentials.usr_clave) {
      this.servG.fun_Mensaje('Por favor ingrese usuario y contraseña', 'warning');
      return;
    }

    console.log('Credenciales enviadas:', this.credentials); // Depuración

    this.auth.login(this.credentials).subscribe(
      (res: any) => {
        console.log('Respuesta del servidor:', res); // Depuración
        if (res && res.token) {
          this.auth.setToken(res.token);
          this.servG.fun_Mensaje('Login exitoso');
          this.router.navigateByUrl('/principal');
        } else {
          this.servG.fun_Mensaje('Respuesta incorrecta del servidor', 'danger');
        }
      },
      (error) => {
        console.error('Error en login:', error); // Depuración
        this.servG.fun_Mensaje(`Error en el login: ${error.status} ${error.statusText}`, 'danger');
      }
    );
  }
}