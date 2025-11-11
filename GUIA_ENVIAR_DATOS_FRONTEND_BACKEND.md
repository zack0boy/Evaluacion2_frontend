# Guía: Pasar Datos del Frontend al Backend

## Resumen rápido
El frontend envía datos al backend usando **métodos HTTP POST, PUT y DELETE** a través de servicios Angular. El backend recibe los datos, los valida y los almacena en la base de datos.

---

## 1. Métodos HTTP Básicos

### POST (Crear)
```typescript
// En el servicio (medidores.service.ts)
crearMedidor(medidor: any): Observable<any> {
  return this.http.post(`${this.apiUrl}`, medidor);
}

// En el componente (medidores.component.ts)
crearMedidor(): void {
  const nuevoMedidor = {
    codigo_medidor: 'MED-001',
    cliente_id: 1,
    direccion_suministro: 'Calle Principal 123',
    estado: true
  };

  this.medidoresService.crearMedidor(nuevoMedidor).subscribe({
    next: (respuesta) => {
      console.log('Medidor creado:', respuesta);
      this.cargarMedidores();
    },
    error: (error) => console.error('Error:', error)
  });
}
```

### PUT (Actualizar)
```typescript
// En el servicio
actualizarMedidor(id: number, medidor: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, medidor);
}

// En el componente
actualizarMedidor(id: number): void {
  const medidorActualizado = {
    codigo_medidor: 'MED-002',
    estado: false
  };

  this.medidoresService.actualizarMedidor(id, medidorActualizado).subscribe({
    next: (respuesta) => {
      console.log('Medidor actualizado:', respuesta);
      this.cargarMedidores();
    },
    error: (error) => console.error('Error:', error)
  });
}
```

### DELETE (Eliminar)
```typescript
// En el servicio
eliminarMedidor(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

// En el componente
eliminarMedidor(id: number): void {
  this.medidoresService.eliminarMedidor(id).subscribe({
    next: (respuesta) => {
      console.log('Medidor eliminado:', respuesta);
      this.cargarMedidores();
    },
    error: (error) => console.error('Error:', error)
  });
}
```

---

## 2. Estructura de Datos (Schemas del Backend)

### Crear Cliente
```typescript
// Datos requeridos
const cliente = {
  rut: "12345678-9",           // String, requerido
  nombre_razon: "Mi Empresa",   // String, requerido
  email: "info@empresa.com",    // String, requerido
  telefono: "+56912345678",     // String, opcional
  direccion: "Calle 123",       // String, requerido
  ciudad: "Santiago"            // String, opcional
};

this.clienteService.crearCliente(cliente).subscribe({
  next: (respuesta) => console.log('Cliente creado:', respuesta),
  error: (error) => console.error('Error:', error)
});
```

### Crear Medidor
```typescript
const medidor = {
  codigo_medidor: "MED-001",        // String, requerido
  cliente_id: 1,                    // Number, requerido
  direccion_suministro: "Calle X",  // String, requerido
  estado: true                      // Boolean, opcional
};

this.medidoresService.crearMedidor(medidor).subscribe({
  next: (respuesta) => console.log('Medidor creado:', respuesta),
  error: (error) => console.error('Error:', error)
});
```

### Crear Lectura
```typescript
const lectura = {
  medidor_id: 1,          // Number, requerido
  lectura_kw: 1234.56,    // Float, requerido
  fecha_lectura: new Date().toISOString(), // ISO string, requerido
  operador: "Juan Pérez"  // String, requerido
};

this.lecturasService.crearLectura(lectura).subscribe({
  next: (respuesta) => console.log('Lectura creada:', respuesta),
  error: (error) => console.error('Error:', error)
});
```

### Crear Boleta
```typescript
const boleta = {
  cliente_id: 1,    // Number, requerido
  mes: 11,          // Number (1-12), requerido
  anio: 2024,       // Number, requerido
  consumo_kwh: 500, // Float, requerido
  valor_unitario: 650 // Float, requerido
  // total se calcula automáticamente: consumo_kwh * valor_unitario
};

this.boletasService.crearBoleta(boleta).subscribe({
  next: (respuesta) => console.log('Boleta creada:', respuesta),
  error: (error) => console.error('Error:', error)
});
```

---

## 3. Ejemplo Completo: Formulario de Medidor

### HTML (medidor-form.component.html)
```html
<div class="formulario">
  <h2>{{ modoEdicion ? 'Editar Medidor' : 'Crear Medidor' }}</h2>
  
  <form (ngSubmit)="guardar()">
    <input 
      [(ngModel)]="medidor.codigo_medidor" 
      name="codigo" 
      placeholder="Código del medidor"
      required
    />
    
    <input 
      [(ngModel)]="medidor.cliente_id" 
      name="cliente_id" 
      type="number"
      placeholder="ID del cliente"
      required
    />
    
    <input 
      [(ngModel)]="medidor.direccion_suministro" 
      name="direccion" 
      placeholder="Dirección"
      required
    />
    
    <label>
      <input 
        [(ngModel)]="medidor.estado" 
        name="estado" 
        type="checkbox"
      />
      Activo
    </label>
    
    <button type="submit">{{ modoEdicion ? 'Actualizar' : 'Crear' }}</button>
  </form>
</div>
```

### TypeScript (medidor-form.component.ts)
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedidoresService } from '../medidores.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-medidor-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medidor-form.component.html'
})
export class MedidorFormComponent implements OnInit {
  medidor = {
    codigo_medidor: '',
    cliente_id: null,
    direccion_suministro: '',
    estado: true
  };
  modoEdicion = false;
  medidorId: number | null = null;

  constructor(
    private medidoresService: MedidoresService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si viene con ID en la ruta, es edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.medidorId = params['id'];
        this.modoEdicion = true;
        this.cargarMedidor();
      }
    });
  }

  cargarMedidor(): void {
    if (this.medidorId) {
      this.medidoresService.obtenerMedidorPorId(this.medidorId).subscribe({
        next: (data) => {
          this.medidor = data;
        },
        error: (error) => console.error('Error al cargar:', error)
      });
    }
  }

  guardar(): void {
    if (this.modoEdicion) {
      // Actualizar
      this.medidoresService.actualizarMedidor(this.medidorId!, this.medidor).subscribe({
        next: (respuesta) => {
          console.log('Medidor actualizado:', respuesta);
          this.router.navigate(['/medidores']);
        },
        error: (error) => console.error('Error:', error)
      });
    } else {
      // Crear
      this.medidoresService.crearMedidor(this.medidor).subscribe({
        next: (respuesta) => {
          console.log('Medidor creado:', respuesta);
          this.router.navigate(['/medidores']);
        },
        error: (error) => console.error('Error:', error)
      });
    }
  }
}
```

---

## 4. Validación de Datos

### En el Frontend (antes de enviar)
```typescript
validarMedidor(medidor: any): boolean {
  if (!medidor.codigo_medidor || medidor.codigo_medidor.trim() === '') {
    alert('El código del medidor es requerido');
    return false;
  }

  if (!medidor.cliente_id || medidor.cliente_id <= 0) {
    alert('Debe seleccionar un cliente válido');
    return false;
  }

  if (!medidor.direccion_suministro || medidor.direccion_suministro.trim() === '') {
    alert('La dirección es requerida');
    return false;
  }

  return true;
}

guardar(): void {
  if (!this.validarMedidor(this.medidor)) {
    return;
  }

  // Continuar con la creación
  this.medidoresService.crearMedidor(this.medidor).subscribe({...});
}
```

### En el Backend (main.py)
```python
@app.post("/api/medidores/", response_model=schemas.MedidorOut)
def crear_medidor(medidor: schemas.MedidorCreate, db: Session = Depends(get_db)):
    """
    Crear un nuevo medidor asociado a un cliente
    """
    try:
        # El backend valida automáticamente según los schemas
        return crud_medidores.create_medidor(db, medidor)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

---

## 5. Manejo de Respuestas

### Respuesta exitosa (200-201)
```typescript
this.medidoresService.crearMedidor(medidor).subscribe({
  next: (respuesta) => {
    // respuesta contiene el objeto creado con ID del servidor
    console.log('ID asignado por el servidor:', respuesta.id_medidor);
    console.log('Datos completos:', respuesta);
    
    // Actualizar lista local
    this.medidores.push(respuesta);
  }
});
```

### Error del cliente (400)
```typescript
error: (error) => {
  // Error de validación (datos inválidos)
  console.error('Error de validación:', error.error.detail);
  alert('Por favor, verifica los datos ingresados');
}
```

### Error del servidor (500)
```typescript
error: (error) => {
  // Error en el servidor
  console.error('Error del servidor:', error);
  alert('Error al procesar la solicitud. Intenta de nuevo.');
}
```

### Completo con loading
```typescript
crear(): void {
  this.cargando = true;
  
  this.medidoresService.crearMedidor(this.medidor).subscribe({
    next: (respuesta) => {
      this.cargando = false;
      console.log('Éxito:', respuesta);
      this.cargarMedidores();
    },
    error: (error) => {
      this.cargando = false;
      console.error('Error:', error);
      alert('Error: ' + (error.error?.detail || 'Intenta de nuevo'));
    }
  });
}
```

---

## 6. Enviar datos por formulario en Angular

### Con FormsModule (ngModel)
```typescript
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule]
})
export class FormComponent {
  datos = { nombre: '', email: '' };
  
  enviar() {
    console.log('Datos a enviar:', this.datos);
    this.servicio.crear(this.datos).subscribe({
      next: (resp) => console.log('Creado:', resp)
    });
  }
}
```

```html
<form (ngSubmit)="enviar()">
  <input [(ngModel)]="datos.nombre" name="nombre" />
  <input [(ngModel)]="datos.email" name="email" />
  <button type="submit">Enviar</button>
</form>
```

### Con Reactive Forms (FormBuilder)
```typescript
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule]
})
export class FormComponent {
  formulario: FormGroup;

  constructor(private fb: FormBuilder, private servicio: MiServicio) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  enviar() {
    if (this.formulario.valid) {
      this.servicio.crear(this.formulario.value).subscribe({
        next: (resp) => console.log('Creado:', resp)
      });
    }
  }
}
```

---

## 7. Casos de Uso Comunes

### Crear y luego actualizar
```typescript
// 1. Crear
this.medidoresService.crearMedidor(medidor).subscribe({
  next: (nuevoMedidor) => {
    console.log('Medidor creado con ID:', nuevoMedidor.id_medidor);
    
    // 2. Actualizar después
    const actualizado = { ...nuevoMedidor, estado: false };
    this.medidoresService.actualizarMedidor(nuevoMedidor.id_medidor, actualizado).subscribe({
      next: (resp) => console.log('Actualizado:', resp)
    });
  }
});
```

### Crear múltiples registros
```typescript
const medidores = [
  { codigo_medidor: 'MED-001', cliente_id: 1, ... },
  { codigo_medidor: 'MED-002', cliente_id: 2, ... },
  { codigo_medidor: 'MED-003', cliente_id: 3, ... }
];

from(medidores).pipe(
  mergeMap(medidor => this.medidoresService.crearMedidor(medidor))
).subscribe({
  next: (resp) => console.log('Medidor creado:', resp),
  complete: () => console.log('Todos creados')
});
```

### Crear con validación del servidor
```typescript
this.medidoresService.crearMedidor(medidor).subscribe({
  next: (respuesta) => {
    if (respuesta.id_medidor) {
      // Éxito
      this.medidores.push(respuesta);
    }
  },
  error: (error) => {
    // El servidor devolvió 400, 404, 500, etc.
    const mensaje = error.error?.detail || 'Error desconocido';
    console.error('Error del servidor:', mensaje);
  }
});
```

---

## 8. Depuración: Ver qué datos se envían

### En el navegador (Network tab)
1. Abre Chrome DevTools (F12)
2. Ve a la pestaña **Network**
3. Realiza la acción (crear/actualizar)
4. Haz clic en la petición POST/PUT
5. Ve la pestaña **Request** para ver qué datos enviaste
6. Ve la pestaña **Response** para ver qué devolvió el servidor

### En el código (con logging)
```typescript
crearMedidor(medidor: any): Observable<any> {
  console.log('📤 Enviando datos:', medidor);
  
  return this.http.post(`${this.apiUrl}`, medidor).pipe(
    tap(respuesta => console.log('✅ Respuesta del servidor:', respuesta)),
    catchError(error => {
      console.error('❌ Error:', error);
      return throwError(() => error);
    })
  );
}
```

---

## 9. Checklist para enviar datos correctamente

- [ ] El servicio HTTP tiene el método POST/PUT/DELETE
- [ ] El componente inyecta el servicio con `constructor(private servicio: ...)`
- [ ] Los datos en el formulario están vinculados con `[(ngModel)]` o `FormGroup`
- [ ] Se llama a `this.servicio.metodo(datos)` en el evento (click, submit)
- [ ] Se usa `.subscribe()` para manejar la respuesta
- [ ] Se validan los datos antes de enviar (required, email, etc.)
- [ ] Se muestra feedback al usuario (loading, toast, alertas)
- [ ] El backend recibe los datos correctamente (verificar en los logs del servidor)
- [ ] Se actualiza la UI después de la operación exitosa

---

¡Ahora puedes enviar datos del frontend al backend correctamente!
