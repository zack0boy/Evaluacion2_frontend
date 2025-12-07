import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HttpClientModule],
})
export class ClientesPage implements OnInit {

  // URL base del backend (FastAPI)
  private apiUrl = 'http://localhost:8000/api/clientes';

  // Estado de la pantalla
  clientes: any[] = [];
  cliente: any = {
    id: null,
    rut: '',
    nombre_razon: '',
    email_contacto: '',
    telefono: '',
    direccion_facturacion: '',
    ciudad: '',
  };

  cargando: boolean = false;
  mensajeError: string = '';
  modoEdicion: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Al entrar a la página, cargamos la lista de clientes
    this.cargarClientes();
  }

  // ==========================
  //   LLAMADAS AL BACKEND
  // ==========================

  obtenerClientes(
    rut?: string,
    nombre?: string,
    page: number = 1,
    limit: number = 50
  ): Observable<any> {
    let params = new HttpParams();

    if (rut) params = params.set('rut', rut);
    if (nombre) params = params.set('nombre_razon', nombre);

    params = params.set('page', page);
    params = params.set('limit', limit);

    return this.http.get<any>(`${this.apiUrl}/`, { params });
  }

  crearCliente(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, data);
  }

  actualizarClienteApi(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/`, data);
  }

  // 👉 Sólo habla con el backend para eliminar
  deleteClienteApi(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/`);
  }

  // ==========================
  //   LÓGICA DE PANTALLA
  // ==========================

  cargarClientes() {
    this.cargando = true;
    this.mensajeError = '';

    this.obtenerClientes().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.clientes = data;
        } else if (data.items) {
          this.clientes = data.items;
        } else if (data.results) {
          this.clientes = data.results;
        } else {
          this.clientes = [];
        }

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes', err);
        this.mensajeError = 'Error al cargar clientes.';
        this.cargando = false;
      },
    });
  }

  guardar() {
    this.cargando = true;
    this.mensajeError = '';

    const payload = {
      rut: this.cliente.rut,
      nombre_razon: this.cliente.nombre_razon,
      email_contacto: this.cliente.email_contacto,
      telefono: this.cliente.telefono,
      direccion_facturacion: this.cliente.direccion_facturacion,
      ciudad: this.cliente.ciudad,
    };

    const peticion =
      this.modoEdicion && this.cliente.id
        ? this.actualizarClienteApi(this.cliente.id, payload)
        : this.crearCliente(payload);

    peticion.subscribe({
      next: () => {
        this.cargando = false;
        this.modoEdicion = false;
        this.resetFormulario();
        this.cargarClientes(); // refrescar tabla
      },
      error: (err) => {
        console.error('Error al guardar cliente', err);
        this.cargando = false;
        this.mensajeError = err.error?.detail || 'Error al guardar cliente';
      },
    });
  }

  editarCliente(c: any) {
    this.modoEdicion = true;

    this.cliente = {
      id: c.id ?? c.id_cliente ?? null,
      rut: c.rut,
      nombre_razon: c.nombre_razon,
      email_contacto: c.email_contacto,
      telefono: c.telefono,
      direccion_facturacion: c.direccion_facturacion,
      ciudad: c.ciudad,
    };
  }

  // 👉 Este es el que se llama desde el HTML (botón Eliminar)
  eliminarCliente(id: number) {
    if (!id) return;

    if (!confirm('¿Seguro que deseas eliminar este cliente?')) {
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    this.deleteClienteApi(id).subscribe({
      next: () => {
        this.cargando = false;
        this.cargarClientes();
      },
      error: (err) => {
        console.error('Error al eliminar cliente', err);
        this.cargando = false;
        this.mensajeError = err.error?.detail || 'Error al eliminar cliente';
      },
    });
  }

  cancelar() {
    this.modoEdicion = false;
    this.resetFormulario();
  }

  resetFormulario() {
    this.cliente = {
      id: null,
      rut: '',
      nombre_razon: '',
      email_contacto: '',
      telefono: '',
      direccion_facturacion: '',
      ciudad: '',
    };
  }
}
