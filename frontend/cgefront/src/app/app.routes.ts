import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'listar-medidores', redirectTo: 'medidores/listar' },
  { path: 'nuevo-medidor', redirectTo: 'medidores/nuevo' },
  { path: 'nuevo', redirectTo: 'clientes/nuevo' },
  { path: 'clientes', loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule) },
  { path: 'medidores', loadChildren: () => import('./medidores/medidores.module').then(m => m.MedidoresModule) },
  { path: 'lecturas', loadChildren: () => import('./lecturas/lecturas.module').then(m => m.LecturasModule) },
  { path: 'boletas', loadChildren: () => import('./boletas/boletas.module').then(m => m.BoletasModule) },
  { path: 'registros', loadChildren: () => import('./registros/registros.module').then(m => m.RegistrosModule) },
  { path: '**', redirectTo: 'clientes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

