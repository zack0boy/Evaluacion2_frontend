import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MedidoresService } from './medidores.service';

@Component({
  selector: 'app-medidores',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [MedidoresService],
  templateUrl: './medidores.component.html',
  styleUrls: ['./medidores.component.scss']
})
export class MedidoresComponent implements OnInit {
  busqueda: string = '';
  medidores: any[] = [];
  // Use id_cliente in the shape sent to the backend; keep cliente for display if present
  medidorActual: any = { id_medidor: 0, codigo_medidor: '', id_cliente: null, cliente: null, direccion_suministro: '', estado: true };
  modoEdicion: boolean = false;

  constructor(private medidoresService: MedidoresService) {}

  ngOnInit(): void {
    this.cargarMedidores();
  }

  cargarMedidores(): void {
    this.medidoresService.obtenerMedidores().subscribe({
      next: (data: any) => {
        // backend may return a plain array or a paginated object
        if (Array.isArray(data)) {
          this.medidores = data;
        } else {
          this.medidores = data.items || data || [];
        }
      },
      error: (err: any) => console.error('Error al cargar medidores:', err)
    });
  }

  filtrarMedidores(): void {
    if (!this.busqueda.trim()) {
      this.cargarMedidores();
      return;
    }

    const termino = this.busqueda.toLowerCase();
    this.medidores = this.medidores.filter(m =>
      String(m.codigo_medidor).toLowerCase().includes(termino) ||
      String(m.cliente?.nombre_razon).toLowerCase().includes(termino)
    );
  }

  crearMedidor(): void {
    if (!this.medidorActual.codigo_medidor) {
      alert('Debe ingresar el código del medidor');
      return;
    }

    // Ensure we build a payload that matches backend expectations
    const payload: any = {
      codigo_medidor: this.medidorActual.codigo_medidor,
      id_cliente: this.medidorActual.id_cliente ?? (this.medidorActual.cliente ? this.medidorActual.cliente.id_cliente : null),
      direccion_suministro: this.medidorActual.direccion_suministro ?? '',
      estado: this.medidorActual.estado ?? 'activo'
    };

    this.medidoresService.crearMedidor(payload).subscribe({
      next: (res: any) => {
        console.log('Medidor creado:', res);
        this.cargarMedidores();
        this.limpiarFormulario();
      },
      error: (err: any) => console.error('Error al crear medidor:', err)
    });
  }

  editarMedidor(id: number): void {
    const medidor = this.medidores.find(m => m.id_medidor === id);
    if (medidor) {
      // Keep both id_cliente and cliente object if available
      this.medidorActual = { ...medidor, id_cliente: medidor.id_cliente ?? medidor.cliente?.id_cliente };
      this.modoEdicion = true;
    }
  }

  guardarMedidor(): void {
    const payload = {
      codigo_medidor: this.medidorActual.codigo_medidor,
      id_cliente: this.medidorActual.id_cliente ?? (this.medidorActual.cliente ? this.medidorActual.cliente.id_cliente : null),
      direccion_suministro: this.medidorActual.direccion_suministro ?? '',
      estado: this.medidorActual.estado ?? 'activo'
    };

    this.medidoresService.actualizarMedidor(this.medidorActual.id_medidor, payload).subscribe({
      next: (res: any) => {
        console.log('Medidor actualizado:', res);
        this.cargarMedidores();
        this.limpiarFormulario();
      },
      error: (err: any) => console.error('Error al actualizar medidor:', err)
    });
  }

  eliminarMedidor(id: number): void {
    if (confirm('¿Está seguro de eliminar este medidor?')) {
      this.medidoresService.eliminarMedidor(id).subscribe({
        next: (res: any) => {
          console.log('Medidor eliminado:', res);
          this.cargarMedidores();
        },
        error: (err: any) => console.error('Error al eliminar medidor:', err)
      });
    }
  }

  limpiarFormulario(): void {
    this.medidorActual = { id_medidor: 0, codigo_medidor: '', id_cliente: null, cliente: null, direccion_suministro: '', estado: true };
    this.modoEdicion = false;
  }
}
