import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent {
  filtro = '';
  clientes: any[] = [];
  clienteActual: any = { id: 0, nombre: '', email: '', rut: '' };
  modoEdicion = false;

  // Filtrar clientes por nombre, rut o email
  filtrarClientes() {
    if (!this.filtro.trim()) return this.clientes;
    const filtroLower = this.filtro.toLowerCase();
    return this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(filtroLower) ||
      c.email.toLowerCase().includes(filtroLower) ||
      c.rut.toLowerCase().includes(filtroLower)
    );
  }

  // Crear un nuevo cliente
  crearCliente() {
    if (!this.clienteActual.nombre || !this.clienteActual.email || !this.clienteActual.rut) {
      alert('Debe completar todos los campos');
      return;
    }
    this.clienteActual.id = this.clientes.length + 1;
    this.clientes.push({ ...this.clienteActual });
    this.limpiarFormulario();
  }

  // Editar un cliente existente (precarga los datos en el formulario)
  editarCliente(id: number) {
    const cliente = this.clientes.find(c => c.id === id);
    if (cliente) {
      this.clienteActual = { ...cliente };
      this.modoEdicion = true;
    }
  }

  // Guardar cambios de un cliente editado
  guardarCliente(id: number) {
    const index = this.clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clientes[index] = { ...this.clienteActual };
      this.limpiarFormulario();
    }
  }

  // Eliminar un cliente
  eliminarCliente(id: number) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.clientes = this.clientes.filter(c => c.id !== id);
    }
  }

  // Limpia el formulario y sale del modo edición
  limpiarFormulario() {
    this.clienteActual = { id: 0, nombre: '', email: '', rut: '' };
    this.modoEdicion = false;
  }
}
