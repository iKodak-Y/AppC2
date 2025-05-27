import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
//agregar iconos
import{
addCircleOutline,
heartHalf,
personAdd,
headset,
star,
heart,
call,
card,
body,
calculator,
trash,
create,
add
}from 'ionicons/icons';
import { provideHttpClient } from '@angular/common/http';
addIcons({
 'add-circle-outline':addCircleOutline,
 'heart-half':heartHalf,
 'person-add':personAdd,
 'headset':headset,
 'star':star,
 'heart':heart,
 'call':call,
 'cart':card,
 'body':body,
 'calculator':calculator,
 'trash': trash,
 'create': create,
 'add': add
});
//fin agregar iconos

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
