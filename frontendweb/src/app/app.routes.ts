import { Routes } from '@angular/router';
import { RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },

  { path: 'nuevo', redirectTo: 'clientes/nuevo' },
  { path: 'clientes', redirectTo: './clientes' },
  { path: 'medidores',redirectTo: './medidores' },
  { path: 'lecturas',redirectTo: './lecturas' },
  { path: 'boletas', redirectTo: './boletas' },
  { path: 'registros',redirectTo: './registros' },
  { path: '**', redirectTo: 'clientes' }
  

];
