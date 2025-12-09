import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
<<<<<<< HEAD:frontendweb/src/app/services/cliente.service.ts
  private apiUrl = 'http://localhost:8000/api/clientes';

  constructor(private http: HttpClient) {}

  obtenerClientes(rut?: string, nombre?: string, page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams();
    if (rut) params = params.set('rut', rut);
    if (nombre) params = params.set('nombre_razon', nombre);
    params = params.set('page', page.toString());
    params = params.set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}/`, { params });
  }

  obtenerClientePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/`);
  }

=======
  private apiUrl = 'http://localhost:8000/clientes'; // Ajusta tu URL backend

  constructor(private http: HttpClient) {}

  obtenerClientes(filtro: string = ''): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?filtro=${filtro}`);
  }

>>>>>>> parent of c88f42e2 (avances front):frontend/cgefront/src/app/clientes/clientes.service.ts
  crearCliente(cliente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cliente);
  }

  actualizarCliente(id: number, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
