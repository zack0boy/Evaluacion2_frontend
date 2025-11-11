import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarRegistrosComponent } from './listar-registros/listar-registros.component';
import { DetalleRegistroComponent } from './detalle-registro/detalle-registro.component';

const routes: Routes = [
  { path: '', component: ListarRegistrosComponent },
  { path: ':id', component: DetalleRegistroComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrosRoutingModule {}
