import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ClientesPage implements OnInit {

 private apiUrl = 'http://localhost:8000/api/clientes';





  modoEdicion: boolean = false;
  cargando: boolean = false;
  mensajeError: string = '';

  cliente: any = {
    rut: '',
    nombre_razon: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: ''
  };



  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  // --- MÉTODOS CRUD ---
  obtenerClientes(rut?: string, nombre?: string, page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams();

    if (rut) params = params.set('rut', rut);
    if (nombre) params = params.set('nombre_razon', nombre);

    params = params.set('page', page);
    params = params.set('limit', limit);

    return this.http.get<any>(`${this.apiUrl}/`, { params });
  }

  obtenerClientePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/`);
  }

  crearCliente(cliente: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, cliente);
  }

  actualizarCliente(id: number, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/`, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/`);
  }

  // --- MÉTODOS PARA EL FORMULARIO ---
  guardar() {
    this.cargando = true;
    this.mensajeError = '';

    const peticion = this.modoEdicion
      ? this.actualizarCliente(this.cliente.id, this.cliente)
      : this.crearCliente(this.cliente);

    peticion.subscribe({
      next: () => {
        this.cargando = false;
        this.modoEdicion = false;
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.error?.detail || 'Error al guardar cliente';
      }
    });
}
}