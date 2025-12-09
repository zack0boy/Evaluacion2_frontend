import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes {

  // Estado del formulario
  modoEdicion: boolean = false;
  cargando: boolean = false;

  // Mensajes
  mensajeError: string = '';
  mensajeExito: string = '';

  // Modelo cliente (con id_cliente como requiere tu backend)
  cliente = {
    id_cliente: 0,
    rut: '',
    nombre_razon: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: ''
  };

  constructor(private clienteService: ClienteService) {}

  // =====================
  // Crear o Editar Cliente
  // =====================
  guardar() {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.cargando = true;

    // ----- EDITAR -----
    if (this.modoEdicion) {
      this.clienteService.actualizarCliente(this.cliente.id_cliente, this.cliente)
        .subscribe({
          next: () => {
            this.mensajeExito = 'Cliente actualizado correctamente ✔️';
            this.cargando = false;
          },
          error: (err) => {
            this.mensajeError = err.error?.detail || 'Error al actualizar cliente ❌';
            this.cargando = false;
          }
        });

      return;
    }

    // ----- CREAR -----
    this.clienteService.crearCliente(this.cliente)
      .subscribe({
        next: (resp) => {
          this.mensajeExito = 'Cliente creado correctamente ✔️';

          // El backend devuelve id_cliente
          this.cliente.id_cliente = resp.id_cliente;

          this.cargando = false;
          this.limpiar();
        },
        error: (err) => {
          this.mensajeError = err.error?.detail || 'Error al crear cliente ❌';
          this.cargando = false;
        }
      });
  }

  // =====================
  // Limpiar formulario
  // =====================
  limpiar() {
    this.cliente = {
      id_cliente: 0,
      rut: '',
      nombre_razon: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: ''
    };

    this.mensajeError = '';
    this.mensajeExito = '';
  }

  // =====================
  // Cancelar acción
  // =====================
  cancelar() {
    this.limpiar();
    this.modoEdicion = false;
  }

  // =====================
  // Cargar cliente para editar
  // (úsalo cuando armes la tabla/listado)
  // =====================
  cargarClienteEditar(data: any) {
    this.modoEdicion = true;

    this.cliente = {
      id_cliente: data.id_cliente,
      rut: data.rut,
      nombre_razon: data.nombre_razon,
      email: data.email_contacto,
      telefono: data.telefono || '',
      direccion: data.direccion_facturacion || '',
      ciudad: '' // Tu backend aún no tiene ciudad
    };
  }
}
