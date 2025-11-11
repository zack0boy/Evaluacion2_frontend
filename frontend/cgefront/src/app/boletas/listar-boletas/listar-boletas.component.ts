import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-listar-boletas',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './listar-boletas.component.html',
  styleUrls: ['./listar-boletas.component.scss']
})
export class ListarBoletasComponent implements OnInit {
  boletas: any[] = [];
  cargando = false;

  ngOnInit(): void {
    this.cargarBoletas();
  }

  cargarBoletas(): void {
    this.cargando = true;
    // Aquí va el servicio real (ejemplo temporal)
    this.boletas = [
      { id: 1, cliente: 'Juan Pérez', monto: 25000, fecha: '2025-11-10' },
      { id: 2, cliente: 'María López', monto: 37000, fecha: '2025-11-11' }
    ];
    this.cargando = false;
  }

  verDetalle(id: number): void {
    console.log('Ver detalle de boleta', id);
  }
}
