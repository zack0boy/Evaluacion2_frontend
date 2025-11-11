import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistrosService, Registro } from '../registros.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-listar-registros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-registros.component.html',
  styleUrls: ['./listar-registros.component.scss']
})
export class ListarRegistrosComponent implements OnInit {
  filtro: string = '';
  cargando: boolean = false;
  registros: Registro[] = [];

  constructor(private registrosService: RegistrosService) {}

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros(): void {
    this.cargando = true;
    this.registrosService.listar().subscribe({
      next: (data: Registro[]) => {
        this.registros = data;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error loading registros:', error);
        this.cargando = false;
      }
    });
  }

  verDetalle(id: number): void {
    // TODO: Navigate to detail view
    console.log('Ver detalle del registro:', id);
  }

  eliminar(id: number): void {
    this.registrosService.eliminar(id).subscribe({
      next: () => {
        this.registros = this.registros.filter(r => r.id !== id);
        console.log('Registro eliminado');
      },
      error: (error: any) => {
        console.error('Error al eliminar:', error);
      }
    });
  }
  formatearFecha(fecha: string): string {
    if (!fecha) return '-';
    const d = new Date(fecha);
    return d.toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
  }
}