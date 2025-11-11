import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8000/api/clientes'; // Endpoint base del backend (usamos slash al construir URLs cuando se necesita)

  constructor(private http: HttpClient) {}

  // Obtener clientes con búsqueda opcional
  obtenerClientes(rut?: string, nombre?: string, page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams();
    if (rut) params = params.set('rut', rut);
    if (nombre) params = params.set('nombre_razon', nombre);
    params = params.set('page', page.toString());
    params = params.set('limit', limit.toString());
    
    // Aseguramos la barra final para evitar redirecciones que puedan eliminar encabezados CORS
    return this.http.get<any>(`${this.apiUrl}/`, { params });
  }

  // Obtener cliente por ID
  obtenerClientePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/`);
  }

  // Crear cliente
  crearCliente(cliente: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, cliente);
  }

  // Actualizar cliente
  actualizarCliente(id: number, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/`, cliente);
  }

  // Eliminar cliente
  eliminarCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/`);
  }
}
