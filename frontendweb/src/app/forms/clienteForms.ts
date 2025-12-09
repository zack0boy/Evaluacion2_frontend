import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ClienteService} from '../services/cliente.service';
@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clienteForms.html',
})
export class ClienteFormComponent implements OnInit {

  cliente = {
    rut: '',
    nombre_razon: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: ''
  };

  clienteId: number | null = null;
  modoEdicion = false;
  cargando = false;
  mensajeError = '';

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.modoEdicion = true;
        this.clienteId = +params['id'];
        this.cargarCliente();
      }
    });
  }

  cargarCliente(): void {
    if (!this.clienteId) return;

    this.cargando = true;

    this.clienteService.obtenerClientePorId(this.clienteId).subscribe({
      next: (data) => {
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
      error: () => {
        this.mensajeError = 'No se pudo cargar el cliente';
        this.cargando = false;
      }
    });
  }

  validarCampos(): boolean {
    if (!this.cliente.rut) return this.error('El RUT es requerido');
    if (!this.cliente.nombre_razon) return this.error('El nombre o razón social es requerido');
    if (!this.cliente.email) return this.error('El email es requerido');
    if (!this.validarEmail(this.cliente.email)) return this.error('Email inválido');
    if (!this.cliente.direccion) return this.error('La dirección es requerida');
    return true;
  }

  error(msg: string): false {
    this.mensajeError = msg;
    return false;
  }

  validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  guardar(): void {
    if (!this.validarCampos()) return;

    this.cargando = true;

    const payload = {
      rut: this.cliente.rut,
      nombre_razon: this.cliente.nombre_razon,
      email_contacto: this.cliente.email,
      telefono: this.cliente.telefono || null,
      direccion_facturacion: this.cliente.direccion || null,
      estado: 'activo'
    };

    if (this.modoEdicion && this.clienteId) {
      this.clienteService.actualizarCliente(this.clienteId, payload).subscribe({
        next: () => {
          alert('Cliente actualizado correctamente');
          this.router.navigate(['/clientes']);
        },
        error: (err) => {
          this.error(err.error?.detail || 'No se pudo actualizar');
          this.cargando = false;
        }
      });
    } else {
      this.clienteService.crearCliente(payload).subscribe({
        next: (res) => {
          alert(`Cliente "${res.nombre_razon}" creado`);
          this.router.navigate(['/clientes']);
        },
        error: (err) => {
          this.error(err.error?.detail || 'No se pudo crear');
          this.cargando = false;
        }
      });
    }
  }

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

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }
}
