import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoletasService {
  private apiUrl = 'http://localhost:8000/api/boletas'; // Endpoint del backend

  constructor(private http: HttpClient) { }

  // Crear boleta
  crearBoleta(boleta: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, boleta);
  }

  // Obtener boletas por cliente
  obtenerBoletasPorCliente(clienteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  // Obtener boletas por mes y año
  obtenerBoletasPorMes(anio: number, mes: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mes/${anio}/${mes}`);
  }

  // Obtener datos de boleta para correo
  obtenerDatosBoleta(boletaId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/correo/boleta/${boletaId}/datos`);
  }

  // Enviar boleta por correo
  enviarBoletaPorCorreo(boletaId: number, datos: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8000/correo/boleta/${boletaId}/enviar`, datos);
  }
}
