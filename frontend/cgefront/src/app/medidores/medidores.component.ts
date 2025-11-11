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
  medidorActual: any = { id_medidor: 0, codigo_medidor: '', cliente: null, estado: true };
  modoEdicion: boolean = false;

  constructor(private medidoresService: MedidoresService) {}

  ngOnInit(): void {
    this.cargarMedidores();
  }

  cargarMedidores(): void {
    this.medidoresService.obtenerMedidores().subscribe({
      next: (data: any) => {
        this.medidores = data.items || [];
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

    this.medidoresService.crearMedidor(this.medidorActual).subscribe({
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
      this.medidorActual = { ...medidor };
      this.modoEdicion = true;
    }
  }

  guardarMedidor(): void {
    this.medidoresService.actualizarMedidor(this.medidorActual.id_medidor, this.medidorActual).subscribe({
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
    this.medidorActual = { id_medidor: 0, codigo_medidor: '', cliente: null, estado: true };
    this.modoEdicion = false;
  }
}
