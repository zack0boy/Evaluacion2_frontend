import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-medidores-service',
  templateUrl: './medidores-service.page.html',
  styleUrls: ['./medidores-service.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MedidoresServicePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

@Injectable({
  providedIn: 'root'
})
export class MedidoresService {

  private apiUrl = 'http://localhost:8000/api/medidores';

  constructor(private http: HttpClient) {}

  obtenerMedidores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  eliminarMedidor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/`);
  }

  obtenerMedidorPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/`);
  }

  crearMedidor(medidor: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, medidor);
  }

  actualizarMedidor(id: number, medidor: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/`, medidor);
  }
}
