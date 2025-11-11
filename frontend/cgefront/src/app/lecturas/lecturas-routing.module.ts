import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarLecturasComponent } from './listar-lecturas/listar-lecturas.component';
import { RegistrarLecturaComponent } from './registrar-lectura/registrar-lectura.component';
const routes: Routes = [
  { path: '', component: ListarLecturasComponent },
  { path: 'nuevo', component: RegistrarLecturaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LecturasRoutingModule {}