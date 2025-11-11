import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RegistrosRoutingModule } from './registros-routing.module';
import { ListarRegistrosComponent } from './listar-registros/listar-registros.component';
import { AgregarRegistroComponent } from './agregar-registro/agregar-registro.component';
import { DetalleRegistroComponent } from './detalle-registro/detalle-registro.component';

@NgModule({
  declarations: [
    ListarRegistrosComponent,
    AgregarRegistroComponent,
    DetalleRegistroComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // ← AÑADIR FormsModule aquí
    RouterModule,
    RegistrosRoutingModule
  ]
})
export class RegistrosModule { }