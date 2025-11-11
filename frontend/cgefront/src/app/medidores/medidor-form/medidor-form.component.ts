import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedidoresService } from '../medidores.service';
import { ClienteService } from '../../clientes/clientes.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-medidor-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medidor-form.component.html',
  styleUrls: ['./medidor-form.component.scss']
})
export class MedidorFormComponent implements OnInit {
  // Formulario (usar el nombre que espera el backend: id_cliente)
  medidor = {
    codigo_medidor: '',
    id_cliente: null as number | null,
    direccion_suministro: '',
    estado: true
  };

  // Variables de estado
  modoEdicion = false;
  medidorId: number | null = null;
  cargando = false;
  clientes: any[] = [];

  constructor(
    private medidoresService: MedidoresService,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar lista de clientes
    this.cargarClientes();

    // Si viene con ID en la ruta, es edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.medidorId = +params['id'];
        this.modoEdicion = true;
        this.cargarMedidorParaEditar();
      }
    });
  }

  // Cargar lista de clientes disponibles
  cargarClientes(): void {
    this.clienteService.obtenerClientes().subscribe({
      next: (data: any) => {
        this.clientes = data.items || data;
      },
      error: (error) => console.error('Error al cargar clientes:', error)
    });
  }

  // Cargar medidor para editar
  cargarMedidorParaEditar(): void {
    if (this.medidorId) {
      this.cargando = true;
      this.medidoresService.obtenerMedidorPorId(this.medidorId).subscribe({
        next: (data) => {
          // Mapear la respuesta al shape del formulario (asegurar id_cliente)
          this.medidor = {
            codigo_medidor: data.codigo_medidor,
            id_cliente: data.id_cliente ?? null,
            direccion_suministro: data.direccion_suministro ?? '',
            estado: data.estado ?? true
          };
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar medidor:', error);
          this.cargando = false;
        }
      });
    }
  }

  // Validar datos antes de enviar
  validar(): boolean {
    if (!this.medidor.codigo_medidor || this.medidor.codigo_medidor.trim() === '') {
      alert('El código del medidor es requerido');
      return false;
    }

    if (!this.medidor.id_cliente || this.medidor.id_cliente <= 0) {
      alert('Debe seleccionar un cliente válido');
      return false;
    }

    if (!this.medidor.direccion_suministro || this.medidor.direccion_suministro.trim() === '') {
      alert('La dirección de suministro es requerida');
      return false;
    }

    return true;
  }

  // Guardar (crear o actualizar)
  guardar(): void {
    if (!this.validar()) {
      return;
    }

    this.cargando = true;

    if (this.modoEdicion && this.medidorId) {
      // Actualizar medidor
      this.medidoresService.actualizarMedidor(this.medidorId, this.medidor).subscribe({
        next: (respuesta) => {
          console.log('✅ Medidor actualizado:', respuesta);
          alert('Medidor actualizado correctamente');
          this.router.navigate(['/medidores']);
        },
        error: (error) => {
          console.error('❌ Error al actualizar:', error);
          alert('Error: ' + (error.error?.detail || 'No se pudo actualizar'));
          this.cargando = false;
        }
      });
    } else {
      // Crear nuevo medidor
      this.medidoresService.crearMedidor(this.medidor).subscribe({
        next: (respuesta) => {
          console.log('✅ Medidor creado:', respuesta);
          alert('Medidor creado correctamente');
          this.router.navigate(['/medidores']);
        },
        error: (error) => {
          console.error('❌ Error al crear:', error);
          alert('Error: ' + (error.error?.detail || 'No se pudo crear'));
          this.cargando = false;
        }
      });
    }
  }

  // Cancelar
  cancelar(): void {
    this.router.navigate(['/medidores']);
  }

  // Limpiar formulario
  limpiar(): void {
    this.medidor = {
      codigo_medidor: '',
      id_cliente: null,
      direccion_suministro: '',
      estado: true
    };
  }
}

