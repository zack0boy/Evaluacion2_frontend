import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LecturasRoutingModule } from './lecturas-routing.module';
import { LecturasComponent } from './lecturas.component';


@NgModule({
  declarations: [
    LecturasComponent
  ],
  imports: [
    CommonModule,
    LecturasRoutingModule
  ]
})
export class LecturasModule { }
