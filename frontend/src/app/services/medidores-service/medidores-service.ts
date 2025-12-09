import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Medidor {
  id_medidor: number;
  codigo_medidor: string;
  direccion_suministro: string;
  estado: string;
  latitud: number;
  longitud: number;
  id_cliente: number;
}

@Injectable({
  providedIn: 'root'
})
export class MedidoresService {

  private api = 'http://localhost:8000/api/medidores/';

  constructor(private http: HttpClient) {}

  listar(): Observable<Medidor[]> {
    return this.http.get<Medidor[]>(this.api);
  }

  obtener(id: number): Observable<Medidor> {
    return this.http.get<Medidor>(`${this.api}${id}`);
  }

  crear(data: any): Observable<Medidor> {
    return this.http.post<Medidor>(this.api, data);
  }

  actualizar(id: number, data: any): Observable<Medidor> {
    return this.http.put<Medidor>(`${this.api}${id}`, data);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.api}${id}`);
  }

  listarPorCliente(clienteId: number): Observable<Medidor[]> {
    return this.http.get<Medidor[]>(`${this.api}cliente/${clienteId}`);
  }
}
