import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrosService } from '../registros.service';

@Component({
  selector: 'app-agregar-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar-registro.component.html',
  styleUrls: ['./agregar-registro.component.scss']
})
export class AgregarRegistroComponent {
  nuevoRegistro = {
    tipo: '',
    descripcion: '',
    operador: '',
    fecha_registro: ''
  };

  mensaje = '';
  cargando = false;

  constructor(
    private registrosService: RegistrosService,
    private router: Router
  ) {}

  guardar(): void {
    if (!this.nuevoRegistro.tipo || !this.nuevoRegistro.descripcion || !this.nuevoRegistro.operador) {
      this.mensaje = 'Por favor completa todos los campos obligatorios.';
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    // Si no se asigna fecha, usar la actual
    if (!this.nuevoRegistro.fecha_registro) {
      this.nuevoRegistro.fecha_registro = new Date().toISOString();
    }

    (this.registrosService.crear(this.nuevoRegistro) as any).subscribe({
      next: (res: any) => {
        console.log('Registro creado:', res);
        this.mensaje = 'Registro creado correctamente.';
        this.cargando = false;

        // Redirige al listado
        setTimeout(() => this.router.navigate(['/']), 1200);
      },
      error: (err: any) => {
        console.error('Error al crear registro:', err);
        this.mensaje = 'Error al guardar el registro.';
        this.cargando = false;
      }
    });
  }
}
