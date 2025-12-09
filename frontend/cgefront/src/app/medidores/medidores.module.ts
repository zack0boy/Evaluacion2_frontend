import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedidoresRoutingModule } from './medidores-routing.module';
import { MedidoresComponent } from './medidores.component';


@NgModule({
  declarations: [
    MedidoresComponent
  ],
  imports: [
    CommonModule,
    MedidoresRoutingModule
  ]
})
export class MedidoresModule { }
