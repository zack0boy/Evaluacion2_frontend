import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistrosRoutingModule } from './registros-routing.module';
import { ListarRegistrosComponent } from './listar-registros/listar-registros.component';
import { DetalleRegistroComponent } from './detalle-registro/detalle-registro.component';

@NgModule({
  declarations: [

    DetalleRegistroComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    RegistrosRoutingModule,  
    ListarRegistrosComponent
  ]
})
export class RegistrosModule {}
