import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-boleta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boleta-detail.component.html',
})
export class DetailBoletaComponent {
  boleta = {
    id: 1,
    cliente: 'Juan Pérez',
    monto: 25000,
    fecha: '2025-11-10',
    estado: 'Pagada'
  };
}
