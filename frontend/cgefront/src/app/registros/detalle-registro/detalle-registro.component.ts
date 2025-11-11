import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistrosService, Registro } from '../registros.service';

@Component({
  selector: 'app-detalle-registro',
  templateUrl: './detalle-registro.component.html',
  styleUrls: ['./detalle-registro.component.scss']
})
export class DetalleRegistroComponent implements OnInit {
  registro?: Registro;
  cargando = false;

  constructor(private route: ActivatedRoute, private registrosService: RegistrosService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarRegistro(id);
  }

  cargarRegistro(id: number) {
    this.cargando = true;
    this.registrosService.obtener(id).subscribe({
      next: (data) => { this.registro = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }
}
