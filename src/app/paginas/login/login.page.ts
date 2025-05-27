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

    console.log('Credenciales enviadas:', this.credentials);

    this.auth.login(this.credentials).subscribe(
      (res: any) => {
        console.log('LOGIN.PAGE SUBSCRIBE SUCCESS: Respuesta del servidor:', res);
        if (res && res.token) {
          this.auth.setToken(res.token);
          this.servG.fun_Mensaje('Login exitoso');
          this.router.navigateByUrl('/principal');
        } else {
          console.log('LOGIN.PAGE SUBSCRIBE SUCCESS: Respuesta sin token:', res);
          this.servG.fun_Mensaje('Respuesta incorrecta del servidor (sin token en success path)', 'danger');
        }
      },
      (err) => { // Cambiado a 'err' para claridad
        console.error('LOGIN.PAGE SUBSCRIBE ERROR: Objeto de error completo:', err);
        let errorMessage = 'Error desconocido en login';
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (err && err.status) {
          errorMessage = `Error ${err.status}: ${err.statusText || err.message}`;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        console.error('LOGIN.PAGE SUBSCRIBE ERROR: Mensaje procesado:', errorMessage);

        // El "s1" podría venir del statusText o de una propiedad del objeto error.
        // Si 'err' es el objeto HTTPErrorResponse, err.error podría contener más info.
        console.error('LOGIN.PAGE SUBSCRIBE ERROR: err.status:', err.status);
        console.error('LOGIN.PAGE SUBSCRIBE ERROR: err.statusText:', err.statusText); // ¿Es esto "s1"?
        console.error('LOGIN.PAGE SUBSCRIBE ERROR: err.message (si existe):', err.message);
        console.error('LOGIN.PAGE SUBSCRIBE ERROR: err.error (cuerpo del error):', err.error);


        this.servG.fun_Mensaje(`Error en el login: ${errorMessage}`, 'danger');
      }
    );
  }
}