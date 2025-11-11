import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../clientes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-clientes.component.html',
  styleUrls: ['./listar-clientes.component.scss']
})
export class ListarClientesComponent implements OnInit {
  filtro = '';
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  cargando = false;

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;
    this.clienteService.obtenerClientes().subscribe({
      next: (data: any) => {
        this.clientes = data.items || data;
        this.clientesFiltrados = this.clientes;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.cargando = false;
      }
    });
  }

  filtrarClientes(): void {
    const termino = (this.filtro || '').trim().toLowerCase();
    if (!termino) {
      this.clientesFiltrados = this.clientes;
      return;
    }
    this.clientesFiltrados = this.clientes.filter(c =>
      String(c.rut).toLowerCase().includes(termino) ||
      String(c.nombre_razon).toLowerCase().includes(termino) ||
      String(c.email).toLowerCase().includes(termino)
    );
  }

  crearCliente(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  editarCliente(id: number): void {
    this.router.navigate(['/clientes/editar', id]);
  }

  eliminarCliente(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.clienteService.eliminarCliente(id).subscribe({
        next: () => {
          console.log('✅ Cliente eliminado');
          this.cargarClientes();
          alert('Cliente eliminado correctamente');
        },
        error: (error) => {
          console.error('❌ Error:', error);
          alert('Error: ' + (error.error?.detail || 'No se pudo eliminar'));
        }
      });
    }
  }
}