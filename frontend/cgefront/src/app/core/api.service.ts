import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8000/api'; // Cambia según tu backend

  constructor(private http: HttpClient) { }

  // ===============================
  // CLIENTES
  // ===============================
  crearCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes/`, cliente);
  }

  obtenerClientes(rut?: string, nombre?: string, page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams();
    if (rut) params = params.set('rut', rut);
    if (nombre) params = params.set('nombre_razon', nombre);
    params = params.set('page', page.toString());
    params = params.set('limit', limit.toString());
    
    return this.http.get(`${this.apiUrl}/clientes/`, { params });
  }

  obtenerClientePorId(clienteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/${clienteId}`);
  }

  actualizarCliente(clienteId: number, cliente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/clientes/${clienteId}`, cliente);
  }

  eliminarCliente(clienteId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientes/${clienteId}`);
  }

  // ===============================
  // MEDIDORES
  // ===============================
  crearMedidor(medidor: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/medidores/`, medidor);
  }

  obtenerMedidores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/medidores/`);
  }

  obtenerMedidorPorId(medidorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/medidores/${medidorId}`);
  }

  actualizarMedidor(medidorId: number, medidor: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/medidores/${medidorId}`, medidor);
  }

  eliminarMedidor(medidorId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/medidores/${medidorId}`);
  }

  obtenerMedidoresPorCliente(clienteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/medidores/cliente/${clienteId}`);
  }

  // ===============================
  // LECTURAS
  // ===============================
  crearLectura(lectura: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lecturas/`, lectura);
  }

  obtenerLecturasPorMedidor(medidorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/lecturas/medidor/${medidorId}`);
  }

  // ===============================
  // BOLETAS
  // ===============================
  crearBoleta(boleta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/boletas/`, boleta);
  }

  obtenerBoletasPorCliente(clienteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/boletas/cliente/${clienteId}`);
  }

  obtenerBoletasPorMes(anio: number, mes: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/boletas/mes/${anio}/${mes}`);
  }

  // ===============================
  // CORREO
  // ===============================
  obtenerDatosBoletaParaCorreo(boletaId: number): Observable<any> {
    return this.http.get(`/correo/boleta/${boletaId}/datos`);
  }

  enviarBoletaPorCorreo(boletaId: number, datos: any): Observable<any> {
    return this.http.post(`/correo/boleta/${boletaId}/enviar`, datos);
  }
}
