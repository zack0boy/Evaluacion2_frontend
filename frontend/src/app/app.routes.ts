import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'clientes',
    loadComponent: () => import('./clientes/clientes.page').then( m => m.ClientesPage)
  },
  {
    path: 'boletas',
    loadComponent: () => import('./boletas/boletas.page').then( m => m.BoletasPage)
  },
  {
    path: 'lecturas',
    loadComponent: () => import('./lecturas/lecturas.page').then( m => m.LecturasPage)
  },
  {
    path: 'medidores',
    loadComponent: () => import('./medidores/medidores.page').then( m => m.MedidoresPage)
  },
  {
    path: 'registros',
    loadComponent: () => import('./registros/registros.page').then( m => m.RegistrosPage)
  },
  {
    path: 'forms',
    loadComponent: () => import('./forms/forms.page').then( m => m.FormsPage)
  },
  {
    path: 'medidores-service',
    loadComponent: () => import('./services/medidores-service/medidores-service.page').then( m => m.MedidoresServicePage)
  },
];
