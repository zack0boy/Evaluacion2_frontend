import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarBoletasComponent } from './listar-boletas/listar-boletas.component';
import { DetailBoletaComponent } from './boleta-detail/boleta-detail.component';
const routes: Routes = [
  { path: '', component: ListarBoletasComponent },
  { path: ':id', component: DetailBoletaComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoletasRoutingModule {}