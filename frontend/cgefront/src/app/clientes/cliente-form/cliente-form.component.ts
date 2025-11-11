import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../clientes.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent implements OnInit {
  // Formulario
  cliente = {
    rut: '',
    nombre_razon: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: ''
  };

  // Variables de estado
  modoEdicion = false;
  clienteId: number | null = null;
  cargando = false;
  mensajeError = '';

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si viene con ID en la ruta, es edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.clienteId = +params['id'];
        this.modoEdicion = true;
        this.cargarClienteParaEditar();
      }
    });
  }

  // Cargar cliente para editar
  cargarClienteParaEditar(): void {
    if (this.clienteId) {
      this.cargando = true;
      this.clienteService.obtenerClientePorId(this.clienteId).subscribe({
        next: (data) => {
          // Mapear campos del backend a los nombres usados en el formulario
          this.cliente = {
            rut: data.rut,
            nombre_razon: data.nombre_razon,
            email: data.email_contacto,
            telefono: data.telefono || '',
            direccion: data.direccion_facturacion || '',
            ciudad: ''
          };
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar cliente:', error);
          this.mensajeError = 'No se pudo cargar el cliente';
          this.cargando = false;
        }
      });
    }
  }

  // Validar datos antes de enviar
  validar(): boolean {
    if (!this.cliente.rut || this.cliente.rut.trim() === '') {
      this.mensajeError = 'El RUT es requerido';
      return false;
    }

    if (!this.cliente.nombre_razon || this.cliente.nombre_razon.trim() === '') {
      this.mensajeError = 'El nombre o razón social es requerido';
      return false;
    }

    if (!this.cliente.email || this.cliente.email.trim() === '') {
      this.mensajeError = 'El email es requerido';
      return false;
    }

    if (!this.validarEmail(this.cliente.email)) {
      this.mensajeError = 'El email no tiene un formato válido';
      return false;
    }

    if (!this.cliente.direccion || this.cliente.direccion.trim() === '') {
      this.mensajeError = 'La dirección es requerida';
      return false;
    }

    return true;
  }

  // Validar formato de email
  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Guardar (crear o actualizar)
  guardar(): void {
    this.mensajeError = '';

    if (!this.validar()) {
      return;
    }

    this.cargando = true;

    // Construir el payload con los nombres que espera el backend
    const payload = {
      rut: this.cliente.rut,
      nombre_razon: this.cliente.nombre_razon,
      email_contacto: this.cliente.email,
      telefono: this.cliente.telefono || null,
      direccion_facturacion: this.cliente.direccion || null,
      estado: 'activo'
    };

    if (this.modoEdicion && this.clienteId) {
      // Actualizar cliente (backend admite campos opcionales)
      this.clienteService.actualizarCliente(this.clienteId, payload).subscribe({
        next: (respuesta) => {
          console.log('✅ Cliente actualizado:', respuesta);
          alert('Cliente actualizado correctamente');
          this.router.navigate(['/clientes']);
        },
        error: (error) => {
          console.error('❌ Error al actualizar:', error);
          this.mensajeError = 'Error: ' + (error.error?.detail || 'No se pudo actualizar');
          this.cargando = false;
        }
      });
    } else {
      // Crear nuevo cliente
      this.clienteService.crearCliente(payload).subscribe({
        next: (respuesta) => {
          console.log('✅ Cliente creado:', respuesta);
          alert(`Cliente "${respuesta.nombre_razon}" creado correctamente`);
          this.router.navigate(['/clientes']);
        },
        error: (error) => {
          console.error('❌ Error al crear:', error);
          // Mostrar detalle si existe (p. ej. validación de Pydantic)
          this.mensajeError = 'Error: ' + (error.error?.detail || JSON.stringify(error.error) || 'No se pudo crear');
          this.cargando = false;
        }
      });
    }
  }

  // Cancelar
  cancelar(): void {
    this.router.navigate(['/clientes']);
  }

  // Limpiar formulario
  limpiar(): void {
    this.cliente = {
      rut: '',
      nombre_razon: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: ''
    };
    this.mensajeError = '';
  }
}
