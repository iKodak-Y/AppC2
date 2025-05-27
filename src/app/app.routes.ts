import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./paginas/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'principal',
    loadComponent: () => import('./paginas/principal/principal.page').then(m => m.PrincipalPage)
  },
  {
    path: 'productos',
    loadComponent: () => import('./paginas/productos/productos.page').then(m => m.ProductosPage)
  },
  {
    path: 'producto',
    loadComponent: () => import('./paginas/producto/producto.page').then(m => m.ProductoPage)
  },
  {
    path: 'clientes',
    loadComponent: () => import('./paginas/clientes/clientes.page').then(m => m.ClientesPage)
  },
  {
    path: 'cliente/:id',
    loadComponent: () => import('./paginas/cliente/cliente.page').then(m => m.ClientePage)
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./paginas/catalogo/catalogo.page').then(m => m.CatalogoPage)
  },
];
