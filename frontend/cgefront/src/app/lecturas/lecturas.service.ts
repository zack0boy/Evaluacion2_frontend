import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LecturasService {
  private apiUrl = 'http://localhost:8000/api/lecturas'; // Endpoint del backend

  constructor(private http: HttpClient) { }

  // Crear lectura
  crearLectura(lectura: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, lectura);
  }

  // Obtener lecturas por medidor
  obtenerLecturasPorMedidor(medidorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/medidor/${medidorId}`);
  }
}
