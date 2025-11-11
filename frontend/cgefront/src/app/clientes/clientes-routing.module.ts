import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarClientesComponent } from './listar-clientes/listar-clientes.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { ClienteDetailComponent } from './cliente-detail/cliente-detail.component';

const routes: Routes = [
  { path: '', component: ListarClientesComponent },
  { path: 'nuevo', component: ClienteFormComponent },
  { path: 'editar/:id', component: ClienteFormComponent },
  { path: ':id', component: ClienteDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule {}
