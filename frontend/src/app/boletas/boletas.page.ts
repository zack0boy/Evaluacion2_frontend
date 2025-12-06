import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-boletas',
  templateUrl: './boletas.page.html',
  styleUrls: ['./boletas.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle]
})
export class BoletasPage implements OnInit {

  // ===============================
  // VARIABLES
  // ===============================

  clientes: any[] = [];
  medidores: any[] = [];
  boleta: any = null;

  clienteSeleccionado: string = '';
  medidorSeleccionado: string = '';

  cliente: any = null;
  medidor: any = null;

  apiUrl = 'http://localhost:8000/api'; // AJUSTA AQUÍ TU URL BASE

  constructor(private http: HttpClient) {}

  // ===============================
  // INICIALIZACIÓN
  // ===============================
  ngOnInit(): void {
    this.cargarClientes();
  }

  // ===============================
  // CARGAR CLIENTES
  // ===============================
  cargarClientes() {
    this.http.get<any[]>(`${this.apiUrl}/clientes/`).subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  // ===============================
  // AL SELECCIONAR CLIENTE
  // ===============================
  cargarMedidores() {
    this.boleta = null;
    this.medidor = null;
    this.medidores = [];

    if (!this.clienteSeleccionado) return;

    // Buscar información del cliente
    this.cliente = this.clientes.find(
      c => c.id_cliente == this.clienteSeleccionado
    );

    // Cargar medidores asociados
    this.http.get<any[]>(`${this.apiUrl}/medidores/cliente/${this.clienteSeleccionado}/`)
      .subscribe({
        next: (data) => {
          this.medidores = data;
        },
        error: (err) => console.error('Error al cargar medidores:', err)
      });
  }

  // ===============================
  // AL SELECCIONAR MEDIDOR
  // ===============================
  cargarBoleta() {
    this.boleta = null;

    if (!this.medidorSeleccionado) return;

    this.medidor = this.medidores.find(
      m => m.id_medidor == this.medidorSeleccionado
    );

    // Intentar obtener boleta del backend
    this.http.get(`${this.apiUrl}/boletas/medidor/${this.medidorSeleccionado}/`)
      .subscribe({
        next: (data: any) => {
          // Si existe boleta → mostrar
          this.boleta = data;
        },
        error: () => {
          // Si NO existe → crear boleta base
          this.boleta = {
            lectura_anterior: 0,
            lectura_actual: 0,
            valor_m3: 650,  // Tarifa base
            consumo: 0,
            total: 0
          };
        }
      });
  }

  // ===============================
  // CALCULAR VALORES
  // ===============================
  recalcular() {
    if (!this.boleta) return;

    this.boleta.consumo = Math.max(
      0,
      (this.boleta.lectura_actual || 0) - (this.boleta.lectura_anterior || 0)
    );

    this.boleta.total = this.boleta.consumo * (this.boleta.valor_m3 || 0);
  }

  // ===============================
  // GUARDAR BOLETA
  // ===============================
  guardarBoleta() {
    if (!this.medidorSeleccionado) {
      alert('Debe seleccionar un medidor');
      return;
    }

    const payload = {
      id_medidor: this.medidorSeleccionado,
      lectura_anterior: this.boleta.lectura_anterior,
      lectura_actual: this.boleta.lectura_actual,
      consumo: this.boleta.consumo,
      valor_m3: this.boleta.valor_m3,
      total: this.boleta.total
    };

    this.http.post(`${this.apiUrl}/boletas/`, payload).subscribe({
      next: () => {
        alert('Boleta guardada correctamente');
      },
      error: (err) => console.error('Error al guardar boleta:', err)
    });
  }

  // ===============================
  // LIMPIAR
  // ===============================
  limpiar() {
    this.clienteSeleccionado = '';
    this.medidorSeleccionado = '';
    this.cliente = null;
    this.medidor = null;
    this.boleta = null;
    this.medidores = [];
  }
}
