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
  crear(nuevoRegistro: { tipo: string; descripcion: string; operador: string; fecha_registro: string; }) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}

  listar(): Observable<Registro[]> {
    return this.http.get<Registro[]>('/registros/');
  }

  obtener(id: number): Observable<Registro> {
    return this.http.get<Registro>(`/registros/${id}/`);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`/registros/${id}/`);
  }
}
