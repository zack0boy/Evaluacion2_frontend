import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Registro {
  id: number;
  tipo: string;             
  descripcion: string;      
  operador: string;         // usuario responsable
  fecha_registro: string;   // timestamp
  id_objeto?: number;       // id del elemento relacionado (lectura/boleta)
}

@Injectable({ providedIn: 'root' })
export class RegistrosService {
  private apiUrl = 'http://localhost:8000/api/registros'; // Endpoint del backend

  constructor(private http: HttpClient) {}

  // Crear registro
  crear(nuevoRegistro: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, nuevoRegistro);
  }

  // Listar todos los registros
  listar(): Observable<Registro[]> {
    return this.http.get<Registro[]>(this.apiUrl);
  }

  // Obtener registro por ID
  obtener(id: number): Observable<Registro> {
    return this.http.get<Registro>(`${this.apiUrl}/${id}`);
  }

  // Eliminar registro
  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
