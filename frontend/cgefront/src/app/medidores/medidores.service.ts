import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedidoresService {
  private apiUrl = 'http://localhost:8000/api/medidores'; // Endpoint correcto del backend

  constructor(private http: HttpClient) {}

  // Obtener todos los medidores
  obtenerMedidores(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtener medidor por ID
  obtenerMedidorPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Obtener medidores por cliente
  obtenerMedidoresPorCliente(clienteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  // Crear medidor
  crearMedidor(medidor: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, medidor);
  }

  // Actualizar medidor
  actualizarMedidor(id: number, medidor: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, medidor);
  }

  // Eliminar medidor
  eliminarMedidor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
