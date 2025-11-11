import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent {
  filtro = '';
  clientes: any[] = [];

  filtrarClientes() {
    // Lógica para filtrar clientes
  }

  crearCliente() {
    // Lógica para crear un nuevo cliente
  }

  editarCliente(id: number) {
    // Lógica para editar un cliente existente
  }

  guardarCliente(id: number) {
    // Lógica para editar un cliente existente
  }

  eliminarCliente(id: number) {
    // Lógica para eliminar un cliente
  }
}