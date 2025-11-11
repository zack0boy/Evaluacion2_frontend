import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarMedidoresComponent } from './listar-medidores/listar-medidores.component';
import { MedidorFormComponent } from './medidor-form/medidor-form.component';
const routes: Routes = [
  { path: '', component: ListarMedidoresComponent },
  { path: 'nuevo', component: MedidorFormComponent },
  { path: 'editar/:id', component: MedidorFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedidoresRoutingModule {}