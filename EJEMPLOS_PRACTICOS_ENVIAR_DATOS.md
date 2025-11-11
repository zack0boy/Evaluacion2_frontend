# Ejemplos Prácticos: Pasar Datos del Frontend al Backend

## 1. Crear Cliente desde Formulario

### HTML (cliente-form.component.html)
```html
<div class="formulario-container">
  <h2>Nuevo Cliente</h2>

  <form (ngSubmit)="crearCliente()">
    
    <div class="form-group">
      <label>RUT *</label>
      <input 
        [(ngModel)]="cliente.rut" 
        name="rut" 
        placeholder="12345678-9"
        required
      />
    </div>

    <div class="form-group">
      <label>Nombre o Razón Social *</label>
      <input 
        [(ngModel)]="cliente.nombre_razon" 
        name="nombre_razon" 
        placeholder="Mi Empresa"
        required
      />
    </div>

    <div class="form-group">
      <label>Email *</label>
      <input 
        [(ngModel)]="cliente.email" 
        name="email" 
        type="email" 
        placeholder="info@empresa.com"
        required
      />
    </div>

    <div class="form-group">
      <label>Teléfono</label>
      <input 
        [(ngModel)]="cliente.telefono" 
        name="telefono" 
        placeholder="+56912345678"
      />
    </div>

    <div class="form-group">
      <label>Dirección *</label>
      <input 
        [(ngModel)]="cliente.direccion" 
        name="direccion" 
        placeholder="Calle Principal 123"
        required
      />
    </div>

    <div class="form-group">
      <label>Ciudad</label>
      <input 
        [(ngModel)]="cliente.ciudad" 
        name="ciudad" 
        placeholder="Santiago"
      />
    </div>

    <div class="button-group">
      <button type="submit" [disabled]="cargando">
        {{ cargando ? 'Creando...' : 'Crear Cliente' }}
      </button>
      <button type="button" (click)="limpiar()">Limpiar</button>
    </div>

  </form>
</div>
```

### TypeScript (cliente-form.component.ts)
```typescript
import { Component } from '@angular/core';
import { FormsModule, CommonModule } from '@angular/common';
import { ClienteService } from '../clientes.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cliente-form.component.html'
})
export class ClienteFormComponent {
  cliente = {
    rut: '',
    nombre_razon: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: ''
  };
  
  cargando = false;
  mensajeError = '';

  constructor(private clienteService: ClienteService) {}

  crearCliente(): void {
    // Validar campos requeridos
    if (!this.cliente.rut.trim() || !this.cliente.nombre_razon.trim() || 
        !this.cliente.email.trim() || !this.cliente.direccion.trim()) {
      alert('Todos los campos marcados con * son requeridos');
      return;
    }

    // Validar formato de email
    if (!this.validarEmail(this.cliente.email)) {
      alert('El email no tiene un formato válido');
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    // Enviar al backend
    this.clienteService.crearCliente(this.cliente).subscribe({
      next: (respuesta) => {
        console.log('✅ Cliente creado:', respuesta);
        alert(`Cliente "${respuesta.nombre_razon}" creado correctamente con ID ${respuesta.id_cliente}`);
        this.limpiar();
        this.cargando = false;
        // Opcional: navegar a la lista de clientes
        // this.router.navigate(['/clientes']);
      },
      error: (error) => {
        console.error('❌ Error al crear cliente:', error);
        this.mensajeError = error.error?.detail || 'Error desconocido';
        alert(`Error: ${this.mensajeError}`);
        this.cargando = false;
      }
    });
  }

  limpiar(): void {
    this.cliente = {
      rut: '',
      nombre_razon: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: ''
    };
    this.mensajeError = '';
  }

  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
```

---

## 2. Crear Lectura desde Modal

### TypeScript (crear-lectura.component.ts)
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, CommonModule } from '@angular/common';
import { LecturasService } from '../lecturas.service';

@Component({
  selector: 'app-crear-lectura',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-lectura.component.html'
})
export class CrearLecturaComponent {
  @Input() medidorId!: number;
  @Output() lecturaCreada = new EventEmitter<any>();
  @Output() cerrar = new EventEmitter<void>();

  lectura = {
    medidor_id: 0,
    lectura_kw: 0,
    fecha_lectura: new Date().toISOString().slice(0, 16), // Formato datetime-local
    operador: ''
  };

  cargando = false;

  constructor(private lecturasService: LecturasService) {}

  ngOnInit(): void {
    this.lectura.medidor_id = this.medidorId;
  }

  crear(): void {
    if (!this.lectura.operador.trim()) {
      alert('El operador es requerido');
      return;
    }

    if (this.lectura.lectura_kw <= 0) {
      alert('La lectura debe ser mayor a 0');
      return;
    }

    this.cargando = true;

    // Convertir fecha a ISO string
    const datosPara Enviar = {
      ...this.lectura,
      fecha_lectura: new Date(this.lectura.fecha_lectura).toISOString()
    };

    this.lecturasService.crearLectura(datosParaEnviar).subscribe({
      next: (respuesta) => {
        console.log('✅ Lectura creada:', respuesta);
        this.lecturaCreada.emit(respuesta);
        alert('Lectura registrada correctamente');
        this.cerrar.emit();
      },
      error: (error) => {
        console.error('❌ Error:', error);
        alert('Error: ' + (error.error?.detail || 'No se pudo crear la lectura'));
        this.cargando = false;
      }
    });
  }

  cancelar(): void {
    this.cerrar.emit();
  }
}
```

### HTML (crear-lectura.component.html)
```html
<div class="modal-overlay" (click)="cancelar()">
  <div class="modal-content" (click)="$event.stopPropagation()">
    
    <div class="modal-header">
      <h3>Registrar Nueva Lectura</h3>
      <button class="btn-close" (click)="cancelar()">✕</button>
    </div>

    <form (ngSubmit)="crear()" class="modal-body">
      
      <div class="form-group">
        <label>Medidor ID</label>
        <input [(ngModel)]="lectura.medidor_id" name="medidor_id" type="number" disabled />
      </div>

      <div class="form-group">
        <label>Lectura (kW) *</label>
        <input 
          [(ngModel)]="lectura.lectura_kw" 
          name="lectura_kw" 
          type="number"
          step="0.01"
          placeholder="1234.56"
          required
        />
      </div>

      <div class="form-group">
        <label>Fecha y Hora *</label>
        <input 
          [(ngModel)]="lectura.fecha_lectura" 
          name="fecha_lectura" 
          type="datetime-local"
          required
        />
      </div>

      <div class="form-group">
        <label>Operador *</label>
        <input 
          [(ngModel)]="lectura.operador" 
          name="operador" 
          placeholder="Nombre del operador"
          required
        />
      </div>

      <div class="modal-footer">
        <button type="submit" class="btn-primary" [disabled]="cargando">
          {{ cargando ? 'Guardando...' : 'Crear Lectura' }}
        </button>
        <button type="button" class="btn-secondary" (click)="cancelar()">Cancelar</button>
      </div>

    </form>

  </div>
</div>
```

---

## 3. Actualizar Boleta desde Tabla (Edición Inline)

### TypeScript (lista-boletas.component.ts)
```typescript
import { Component, OnInit } from '@angular/core';
import { FormsModule, CommonModule } from '@angular/common';
import { BoletasService } from '../boletas.service';

@Component({
  selector: 'app-lista-boletas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './lista-boletas.component.html'
})
export class ListaBoletasComponent implements OnInit {
  boletas: any[] = [];
  cargando = false;
  boletaEnEdicion: number | null = null;

  constructor(private boletasService: BoletasService) {}

  ngOnInit(): void {
    this.cargarBoletas();
  }

  cargarBoletas(): void {
    this.cargando = true;
    this.boletasService.obtenerBoletasPorMes(2024, 11).subscribe({
      next: (data) => {
        this.boletas = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.cargando = false;
      }
    });
  }

  editarBoleta(boleta: any): void {
    this.boletaEnEdicion = boleta.id_boleta;
  }

  guardarBoleta(boleta: any): void {
    const datos = {
      consumo_kwh: boleta.consumo_kwh,
      valor_unitario: boleta.valor_unitario
      // El total se recalcula automáticamente en el backend
    };

    this.boletasService.actualizarBoleta(boleta.id_boleta, datos).subscribe({
      next: (respuesta) => {
        console.log('✅ Boleta actualizada:', respuesta);
        Object.assign(boleta, respuesta);
        this.boletaEnEdicion = null;
        alert('Boleta actualizada correctamente');
      },
      error: (error) => {
        console.error('❌ Error:', error);
        alert('Error al actualizar: ' + (error.error?.detail || ''));
      }
    });
  }

  cancelarEdicion(): void {
    this.boletaEnEdicion = null;
    this.cargarBoletas();
  }

  eliminarBoleta(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta boleta?')) {
      this.boletasService.eliminarBoleta(id).subscribe({
        next: () => {
          console.log('✅ Boleta eliminada');
          this.cargarBoletas();
          alert('Boleta eliminada correctamente');
        },
        error: (error) => {
          console.error('❌ Error:', error);
          alert('Error al eliminar');
        }
      });
    }
  }
}
```

### HTML (lista-boletas.component.html)
```html
<table class="boletas-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Cliente</th>
      <th>Mes/Año</th>
      <th>Consumo (kWh)</th>
      <th>Valor Unitario</th>
      <th>Total</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let boleta of boletas" [class.editando]="boletaEnEdicion === boleta.id_boleta">
      <td>{{ boleta.id_boleta }}</td>
      <td>{{ boleta.cliente?.nombre_razon }}</td>
      <td>{{ boleta.mes }}/{{ boleta.anio }}</td>
      
      <!-- Edición inline si está en modo edición -->
      <td *ngIf="boletaEnEdicion !== boleta.id_boleta">{{ boleta.consumo_kwh }}</td>
      <td *ngIf="boletaEnEdicion === boleta.id_boleta">
        <input [(ngModel)]="boleta.consumo_kwh" type="number" step="0.01" class="input-inline" />
      </td>

      <td *ngIf="boletaEnEdicion !== boleta.id_boleta">{{ boleta.valor_unitario }}</td>
      <td *ngIf="boletaEnEdicion === boleta.id_boleta">
        <input [(ngModel)]="boleta.valor_unitario" type="number" step="0.01" class="input-inline" />
      </td>

      <td>{{ boleta.total | currency }}</td>

      <!-- Botones de acción -->
      <td>
        <ng-container *ngIf="boletaEnEdicion !== boleta.id_boleta">
          <button (click)="editarBoleta(boleta)" class="btn-editar">Editar</button>
          <button (click)="eliminarBoleta(boleta.id_boleta)" class="btn-eliminar">Eliminar</button>
        </ng-container>

        <ng-container *ngIf="boletaEnEdicion === boleta.id_boleta">
          <button (click)="guardarBoleta(boleta)" class="btn-guardar">✓ Guardar</button>
          <button (click)="cancelarEdicion()" class="btn-cancelar">✕ Cancelar</button>
        </ng-container>
      </td>
    </tr>
  </tbody>
</table>
```

---

## 4. Enviar Múltiples Datos (Batch)

### TypeScript
```typescript
import { forkJoin, from, mergeMap } from 'rxjs';

// Opción 1: Enviar múltiples registros en paralelo
enviarMultiples(): void {
  const medidores = [
    { codigo_medidor: 'MED-001', cliente_id: 1, direccion_suministro: 'Calle A' },
    { codigo_medidor: 'MED-002', cliente_id: 2, direccion_suministro: 'Calle B' },
    { codigo_medidor: 'MED-003', cliente_id: 3, direccion_suministro: 'Calle C' }
  ];

  // Usar forkJoin para enviar todos en paralelo
  forkJoin(
    medidores.map(m => this.medidoresService.crearMedidor(m))
  ).subscribe({
    next: (respuestas) => {
      console.log('✅ Todos creados:', respuestas);
      alert(`${respuestas.length} medidores creados correctamente`);
    },
    error: (error) => {
      console.error('❌ Error en alguno:', error);
      alert('Error: alguno de los registros falló');
    }
  });
}

// Opción 2: Enviar secuencialmente (uno por uno)
enviarSecuencialmente(): void {
  const medidores = [...];
  
  from(medidores).pipe(
    mergeMap(m => this.medidoresService.crearMedidor(m))
  ).subscribe({
    next: (respuesta) => {
      console.log('✅ Creado:', respuesta.codigo_medidor);
    },
    error: (error) => {
      console.error('❌ Error:', error);
    },
    complete: () => {
      console.log('✅ Todos completados');
    }
  });
}
```

---

## 5. Enviar Archivo (Opcional: CSV/Excel)

### TypeScript
```typescript
import { HttpClient } from '@angular/common/http';

subirArchivoMedidores(archivo: File): void {
  const formData = new FormData();
  formData.append('file', archivo);

  this.http.post('/api/medidores/importar', formData).subscribe({
    next: (respuesta: any) => {
      console.log(`✅ Se importaron ${respuesta.cantidad} medidores`);
    },
    error: (error) => {
      console.error('❌ Error:', error);
    }
  });
}
```

### HTML
```html
<div class="form-group">
  <label>Importar Medidores (CSV)</label>
  <input 
    type="file" 
    accept=".csv"
    (change)="subirArchivoMedidores($any($event.target).files[0])"
  />
</div>
```

---

## 6. Actualizar con Confirmación

### TypeScript
```typescript
actualizarConConfirmacion(id: number, datos: any): void {
  if (confirm('¿Estás seguro de que deseas actualizar este registro?')) {
    this.servicio.actualizar(id, datos).subscribe({
      next: () => {
        alert('✅ Actualizado correctamente');
        this.recargar();
      },
      error: () => {
        alert('❌ Error al actualizar');
      }
    });
  }
}
```

---

## 7. Enviar con Retry (Reintentos)

### TypeScript
```typescript
import { retry, catchError } from 'rxjs/operators';

crear(datos: any): void {
  this.servicio.crear(datos).pipe(
    retry(3), // Reintentar hasta 3 veces si falla
    catchError(error => {
      console.error('Error después de 3 reintentos:', error);
      throw error;
    })
  ).subscribe({
    next: (resp) => console.log('✅ Exitoso:', resp),
    error: (error) => alert('Error definitivo')
  });
}
```

---

Estos son los patrones más comunes para pasar datos del frontend al backend en Angular. ¡Adáptalos según tus necesidades!
