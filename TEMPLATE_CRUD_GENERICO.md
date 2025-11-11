# Template: Cómo Crear un CRUD Completo (Plantilla para otras entidades)

## Resumen

Aquí está el "molde" que usé para Clientes y Medidores. Úsalo para implementar lo mismo para **Boletas**, **Lecturas**, **Registros**, etc.

---

## Paso 1: Crear/Verificar Servicio HTTP

**Archivo**: `src/app/[entidad]/[entidad].service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class [EntidadService] {
  private apiUrl = 'http://localhost:8000/api/[entidad]';

  constructor(private http: HttpClient) {}

  obtener[Entidades](): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  obtener[Entidad]PorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crear[Entidad](datos: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, datos);
  }

  actualizar[Entidad](id: number, datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar[Entidad](id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
```

**Ejemplos reales**:
- `ClienteService` → `http://localhost:8000/api/clientes`
- `MedidoresService` → `http://localhost:8000/api/medidores`
- `BoletasService` → `http://localhost:8000/api/boletas`
- `LecturasService` → `http://localhost:8000/api/lecturas`

---

## Paso 2: Crear Componente de Listado

**Archivo**: `src/app/[entidad]/listar-[entidad]/listar-[entidad].component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { [EntidadService] } from '../[entidad].service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-[entidad]',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-[entidad].component.html'
})
export class Listar[Entidad]Component implements OnInit {
  filtro = '';
  [entidades]: any[] = [];
  [entidades]Filtrados: any[] = [];
  cargando = false;

  constructor(
    private [entidadService]: [EntidadService],
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargar[Entidades]();
  }

  cargar[Entidades](): void {
    this.cargando = true;
    this.[entidadService].obtener[Entidades]().subscribe({
      next: (data: any) => {
        this.[entidades] = data.items || data;
        this.[entidades]Filtrados = this.[entidades];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.cargando = false;
      }
    });
  }

  filtrar[Entidades](): void {
    const termino = (this.filtro || '').trim().toLowerCase();
    if (!termino) {
      this.[entidades]Filtrados = this.[entidades];
      return;
    }
    this.[entidades]Filtrados = this.[entidades].filter(item =>
      JSON.stringify(item).toLowerCase().includes(termino)
    );
  }

  crear[Entidad](): void {
    this.router.navigate(['[entidad]/nuevo']);
  }

  editar[Entidad](id: number): void {
    this.router.navigate(['[entidad]/editar', id]);
  }

  eliminar[Entidad](id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar?')) {
      this.[entidadService].eliminar[Entidad](id).subscribe({
        next: () => {
          this.cargar[Entidades]();
          alert('Eliminado correctamente');
        },
        error: (error) => alert('Error: ' + error.error?.detail)
      });
    }
  }
}
```

**Reemplazar**:
- `[EntidadService]` → `ClienteService`, `MedidoresService`, etc.
- `[entidad]` → `cliente`, `medidor`, `boleta`, etc.
- `[Entidad]` → `Cliente`, `Medidor`, `Boleta`, etc.
- `[Entidades]` → `Clientes`, `Medidores`, `Boletas`, etc.

---

## Paso 3: Crear Componente de Formulario

**Archivo**: `src/app/[entidad]/[entidad]-form/[entidad]-form.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { [EntidadService] } from '../[entidad].service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-[entidad]-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './[entidad]-form.component.html'
})
export class [Entidad]FormComponent implements OnInit {
  // Define los campos según la entidad
  datos = {
    // campo1: '',
    // campo2: '',
    // campo3: ''
  };

  modoEdicion = false;
  registroId: number | null = null;
  cargando = false;
  mensajeError = '';

  constructor(
    private [entidadService]: [EntidadService],
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.registroId = +params['id'];
        this.modoEdicion = true;
        this.cargarParaEditar();
      }
    });
  }

  cargarParaEditar(): void {
    if (this.registroId) {
      this.cargando = true;
      this.[entidadService].obtener[Entidad]PorId(this.registroId).subscribe({
        next: (data) => {
          this.datos = data;
          this.cargando = false;
        },
        error: (error) => {
          this.mensajeError = 'Error al cargar';
          this.cargando = false;
        }
      });
    }
  }

  validar(): boolean {
    // Validar campos requeridos
    if (!this.datos['campo1'] || this.datos['campo1'].toString().trim() === '') {
      this.mensajeError = 'Campo 1 es requerido';
      return false;
    }
    return true;
  }

  guardar(): void {
    this.mensajeError = '';
    if (!this.validar()) return;

    this.cargando = true;

    if (this.modoEdicion && this.registroId) {
      this.[entidadService].actualizar[Entidad](this.registroId, this.datos).subscribe({
        next: () => {
          alert('Actualizado correctamente');
          this.router.navigate(['[entidad]']);
        },
        error: (error) => {
          this.mensajeError = error.error?.detail || 'Error';
          this.cargando = false;
        }
      });
    } else {
      this.[entidadService].crear[Entidad](this.datos).subscribe({
        next: () => {
          alert('Creado correctamente');
          this.router.navigate(['[entidad]']);
        },
        error: (error) => {
          this.mensajeError = error.error?.detail || 'Error';
          this.cargando = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['[entidad]']);
  }

  limpiar(): void {
    this.datos = {};
    this.mensajeError = '';
  }
}
```

---

## Paso 4: HTML del Formulario

**Archivo**: `src/app/[entidad]/[entidad]-form/[entidad]-form.component.html`

```html
<div class="p-6 bg-gray-100 min-h-screen">
  <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
    
    <h2 class="text-3xl font-bold mb-6 text-blue-700">
      {{ modoEdicion ? '✏️ Editar' : '➕ Crear Nuevo' }}
    </h2>

    <div *ngIf="mensajeError" class="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
      <p class="font-semibold">⚠️ {{ mensajeError }}</p>
    </div>

    <form (ngSubmit)="guardar()">
      
      <!-- REPETIR POR CADA CAMPO -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-2">Campo 1 *</label>
        <input 
          [(ngModel)]="datos.campo1" 
          name="campo1" 
          type="text"
          placeholder="Ej: valor"
          class="border border-gray-300 p-3 rounded w-full focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-2">Campo 2</label>
        <input 
          [(ngModel)]="datos.campo2" 
          name="campo2" 
          type="email"
          placeholder="Ej: email@example.com"
          class="border border-gray-300 p-3 rounded w-full focus:outline-none focus:border-blue-500"
        />
      </div>

      <div class="mb-6">
        <label class="flex items-center text-sm font-semibold">
          <input 
            [(ngModel)]="datos.campo3" 
            name="campo3" 
            type="checkbox"
            class="w-4 h-4 mr-2 cursor-pointer"
          />
          <span>Activo</span>
        </label>
      </div>

      <div class="flex gap-4">
        <button 
          type="submit"
          [disabled]="cargando"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded transition disabled:bg-gray-400"
        >
          {{ cargando ? '⏳ Guardando...' : (modoEdicion ? '💾 Actualizar' : '➕ Crear') }}
        </button>

        <button 
          type="button"
          (click)="limpiar()"
          class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-8 rounded transition"
          [disabled]="cargando"
        >
          🔄 Limpiar
        </button>

        <button 
          type="button"
          (click)="cancelar()"
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded transition"
          [disabled]="cargando"
        >
          ❌ Cancelar
        </button>
      </div>

    </form>

  </div>
</div>
```

---

## Paso 5: HTML del Listado

**Archivo**: `src/app/[entidad]/listar-[entidad]/listar-[entidad].component.html`

```html
<div class="p-6 bg-gray-100 min-h-screen">
  <h2 class="text-2xl font-bold mb-4 text-blue-700">📋 Listado de [Entidades]</h2>

  <div class="flex mb-4 gap-2">
    <input 
      [(ngModel)]="filtro" 
      (input)="filtrar[Entidades]()" 
      placeholder="Buscar..." 
      class="border p-2 rounded w-full"
    />
    <button (click)="crear[Entidad]()" class="bg-blue-600 text-white px-4 py-2 rounded">
      + Nuevo
    </button>
  </div>

  <table class="table-auto w-full bg-white shadow-md rounded-lg" *ngIf="!cargando && [entidades]Filtrados.length > 0; else vacio">
    <thead class="bg-blue-600 text-white">
      <tr>
        <th class="p-3">Columna 1</th>
        <th class="p-3">Columna 2</th>
        <th class="p-3">Columna 3</th>
        <th class="p-3 text-center">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let item of [entidades]Filtrados" class="border-b hover:bg-gray-50">
        <td class="p-3">{{ item.campo1 }}</td>
        <td class="p-3">{{ item.campo2 }}</td>
        <td class="p-3">{{ item.campo3 }}</td>
        <td class="p-3 flex justify-center gap-2">
          <button (click)="editar[Entidad](item.id)" class="bg-blue-500 text-white px-3 py-1 rounded">Editar</button>
          <button (click)="eliminar[Entidad](item.id)" class="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>

  <ng-template #vacio>
    <p *ngIf="!cargando" class="text-gray-500 text-center mt-6">
      {{ [entidades]Filtrados.length === 0 && filtro ? 'No hay resultados.' : 'No hay registros.' }}
    </p>
    <p *ngIf="cargando" class="text-gray-500 text-center mt-6">⏳ Cargando...</p>
  </ng-template>
</div>
```

---

## Paso 6: Configurar Rutas

**Archivo**: `src/app/[entidad]/[entidad]-routing.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Listar[Entidad]Component } from './listar-[entidad]/listar-[entidad].component';
import { [Entidad]FormComponent } from './[entidad]-form/[entidad]-form.component';

const routes: Routes = [
  { path: '', component: Listar[Entidad]Component },
  { path: 'nuevo', component: [Entidad]FormComponent },
  { path: 'editar/:id', component: [Entidad]FormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class [Entidad]RoutingModule {}
```

---

## Paso 7: Agregar ruta rápida en app.routes.ts (Opcional)

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'nuevo-[entidad]', redirectTo: '[entidad]/nuevo' },  // ← Agregar esto
  { path: 'listar-[entidad]', redirectTo: '[entidad]/listar' }, // ← O esto
  { path: '[entidad]', loadChildren: () => import('./ [entidad]/[entidad].module').then(m => m.[Entidad]Module) },
  // ...
];
```

---

## Checklist de Implementación

- [ ] Servicio HTTP con métodos CRUD
- [ ] Componente de Listado con búsqueda
- [ ] Componente de Formulario (crear/editar)
- [ ] HTML del listado con tabla
- [ ] HTML del formulario con campos
- [ ] Rutas configuradas
- [ ] Validaciones en el formulario
- [ ] Manejo de errores
- [ ] Indicador de cargando
- [ ] Mensajes de éxito/error

---

## Ejemplo Real: Implementar CRUD para Boletas

Reemplaza así:
- `[Entidad]` → `Boleta`
- `[Entidades]` → `Boletas`
- `[entidad]` → `boleta`
- `[entidades]` → `boletas`

### Servicio
```typescript
export class BoletasService {
  private apiUrl = 'http://localhost:8000/api/boletas';
  
  obtenerBoletas(): Observable<any> { ... }
  obtenerBoletaPorId(id: number): Observable<any> { ... }
  crearBoleta(datos: any): Observable<any> { ... }
  actualizarBoleta(id: number, datos: any): Observable<any> { ... }
  eliminarBoleta(id: number): Observable<any> { ... }
}
```

### Datos del Formulario
```typescript
datos = {
  cliente_id: null,
  mes: 11,
  anio: 2024,
  consumo_kwh: 0,
  valor_unitario: 0
  // total se calcula en el backend
};
```

### Campos del Formulario
```html
<input [(ngModel)]="datos.cliente_id" type="number" placeholder="ID Cliente" />
<input [(ngModel)]="datos.mes" type="number" min="1" max="12" placeholder="Mes" />
<input [(ngModel)]="datos.anio" type="number" placeholder="Año" />
<input [(ngModel)]="datos.consumo_kwh" type="number" step="0.01" placeholder="Consumo kWh" />
<input [(ngModel)]="datos.valor_unitario" type="number" step="0.01" placeholder="Valor Unitario" />
```

---

## Resumen

Este template acelera la implementación de CRUD para cualquier entidad:

1. **Servicio** → Métodos HTTP
2. **Listado** → Tabla + búsqueda + acciones
3. **Formulario** → Crear/Editar + validaciones
4. **Rutas** → Navegar entre componentes
5. **Backend** → Ya debe tener endpoints listos

**Tiempo estimado**: 30-45 minutos por entidad

---

¿Quieres que implemente esto para **Boletas**, **Lecturas** o **Registros**?
