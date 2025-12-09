import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class MapaPage implements OnInit, AfterViewInit {

  map!: L.Map;
  marker!: L.Marker;
  mensajeError: string = "";

  medidores: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarMedidores();
  }

  ngAfterViewInit(): void {
    // Deja tiempo a Ionic para renderizar el DOM
    setTimeout(() => {
      this.inicializarMapa();
    }, 300);
  }

  // ================================
  //       CARGAR MEDIDORES
  // ================================
  cargarMedidores() {
    this.http.get<any[]>('http://localhost:8000/api/medidores/')
      .subscribe({
        next: (data) => {
          this.medidores = data;

          // Si ya hay mapa, mostrarlos
          if (this.map) this.mostrarMedidoresEnMapa();
        },
        error: () => {
          this.mensajeError = "Error cargando medidores.";
        }
      });
  }

  // ================================
  //             MAPA
  // ================================
inicializarMapa() {
  const lat = -33.4489;
  const lon = -70.6693;

  this.map = L.map('map').setView([lat, lon], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

    maxZoom: 19
  }).addTo(this.map);
  this.marker = L.marker([lat, lon], { draggable: false }).addTo(this.map);

  // 👇 Agregar ciudades
  this.agregarCiudades();

  // 👇 Mostrar medidores si existen
  if (this.medidores.length > 0) {
    this.mostrarMedidoresEnMapa();
  }
}


  // ================================
  //    MARCADORES DE MEDIDORES
  // ================================
  mostrarMedidoresEnMapa() {
    for (let m of this.medidores) {
      if (!m.latitud || !m.longitud) continue;

      const marker = L.marker([m.latitud, m.longitud]).addTo(this.map);

      marker.bindPopup(`
        <b>${m.codigo_medidor}</b><br>
        Cliente: ${m.cliente?.nombre_razon || 'N/A'}<br>
        Dirección: ${m.direccion_suministro || 'Sin dirección'}<br>
      `);
    }
  }

  // ================================
  //       BOTÓN UBICACIÓN GPS
  // ================================
  centrarEnUsuario() {
    if (!navigator.geolocation) {
      this.mensajeError = "La geolocalización no es soportada por este navegador.";
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        this.map.setView([lat, lon], 15);

        // Mover marcador principal
        this.marker.setLatLng([lat, lon]);
        this.marker.bindPopup("📍 Estás aquí").openPopup();
      },
      () => {
        this.mensajeError = "No se pudo obtener tu ubicación. Activa el GPS.";
      }
    );
  }
agregarCiudades() {

  const ciudades = [
    {
      nombre: "Santiago",
      lat: -33.4489,
      lon: -70.6693
    },
    {
      nombre: "Talca",
      lat: -35.4302,
      lon: -71.6590
    },
    {
      nombre: "Valparaíso",
      lat: -33.0472,
      lon: -71.6127
    }
  ];

  ciudades.forEach(ciudad => {
    const marker = L.marker([ciudad.lat, ciudad.lon]).addTo(this.map);

    marker.bindPopup(`
      <b>${ciudad.nombre}</b><br>
      Ciudad de Chile
    `);
  });
}

}

const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
const iconUrl = 'assets/leaflet/marker-icon.png';
const shadowUrl = 'assets/leaflet/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});