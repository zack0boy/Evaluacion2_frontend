import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { MedidoresService } from '../services/medidores-service/medidores-service.page';

@Component({
  selector: 'app-medidores',
  templateUrl: './medidores.page.html',
  styleUrls: ['./medidores.page.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonHeader, IonToolbar, IonTitle],
})
export class MedidoresPage implements OnInit {

  medidores: any[] = [];

  constructor(private medidoresService: MedidoresService) {}

  ngOnInit() {
    this.cargarMedidores();
  }

  cargarMedidores() {
    this.medidoresService.obtenerMedidores().subscribe({
      next: (data) => this.medidores = data,
      error: (err) => console.error(err)
    });
  }

  editarMedidor(id: number) {
    console.log("Editar", id);
  }

  eliminarMedidor(id: number) {
    if (!confirm("¿Eliminar medidor?")) return;

    this.medidoresService.eliminarMedidor(id).subscribe({
      next: () => this.cargarMedidores(),
      error: (err) => console.error(err)
    });
  }
}
