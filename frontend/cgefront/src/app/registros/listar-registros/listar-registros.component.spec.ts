import { Component, OnInit } from '@angular/core';
import { RegistrosService, Registro } from '../registros.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-registros',
  templateUrl: './listar-registros.component.html',
  styleUrls: ['./listar-registros.component.scss']
})
export class ListarRegistrosComponent implements OnInit {
[x: string]: any;

  formatearFecha(arg0: any) {
  throw new Error('Method not implemented.');
  }

  registros: Registro[] = [];
  filtro = '';
  cargando = false;

  constructor(private registrosService: RegistrosService, private router: Router) {}

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.cargando = true;
    this.registrosService.listar().subscribe({
      next: (data) => {
        this.registros = data.filter(r =>
          r.descripcion.toLowerCase().includes(this.filtro.toLowerCase()) ||
          r.operador.toLowerCase().includes(this.filtro.toLowerCase())
        );
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/registros', id]);
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este registro?')) {
      this.registrosService.eliminar(id).subscribe(() => this.cargarRegistros());
    }
  }
}

