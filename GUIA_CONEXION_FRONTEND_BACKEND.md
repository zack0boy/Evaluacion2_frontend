# Guía: Conexión Frontend-Backend

## Resumen
El frontend (Angular) está configurado para conectarse con el backend (FastAPI) a través de servicios HTTP. Todos los servicios ahora apuntan a `http://localhost:8000/api` (desarrollo) o a tu dominio en producción.

---

## 1. Configuración Base

### URLs del Backend
- **Desarrollo**: `http://localhost:8000/api`
- **Producción**: `https://tu-dominio.com/api` (actualizar en `environment.prod.ts`)

### Archivos clave
- **Core API Service**: `src/app/core/api.service.ts` - Servicio base con todos los métodos HTTP
- **Servicios específicos**:
  - `src/app/clientes/clientes.service.ts`
  - `src/app/medidores/medidores.service.ts`
  - `src/app/lecturas/lecturas.service.ts`
  - `src/app/boletas/boletas.service.ts`
  - `src/app/registros/registros.service.ts`

---

## 2. Endpoints Disponibles del Backend

### Clientes
- `POST /api/clientes/` - Crear cliente
- `GET /api/clientes/` - Listar clientes (con filtros opcionales: rut, nombre_razon, page, limit)
- `GET /api/clientes/{cliente_id}` - Obtener cliente por ID
- `PUT /api/clientes/{cliente_id}` - Actualizar cliente
- `DELETE /api/clientes/{cliente_id}` - Eliminar cliente

### Medidores
- `POST /api/medidores/` - Crear medidor
- `GET /api/medidores/` - Listar todos los medidores
- `GET /api/medidores/{medidor_id}` - Obtener medidor por ID
- `PUT /api/medidores/{medidor_id}` - Actualizar medidor
- `DELETE /api/medidores/{medidor_id}` - Eliminar medidor
- `GET /api/medidores/cliente/{cliente_id}` - Listar medidores de un cliente

### Lecturas
- `POST /api/lecturas/` - Crear lectura
- `GET /api/lecturas/medidor/{medidor_id}` - Listar lecturas de un medidor

### Boletas
- `POST /api/boletas/` - Crear boleta
- `GET /api/boletas/cliente/{cliente_id}` - Listar boletas de un cliente
- `GET /api/boletas/mes/{anio}/{mes}` - Listar boletas por mes y año

### Correo
- `GET /correo/boleta/{boleta_id}/datos` - Obtener datos de boleta para correo
- `POST /correo/boleta/{boleta_id}/enviar` - Enviar boleta por correo

---

## 3. Cómo usar los Servicios en Componentes

### Ejemplo 1: Listar Clientes
```typescript
import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../clientes.service';

@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html'
})
export class ListarClientesComponent implements OnInit {
  clientes: any[] = [];
  cargando = false;

  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.cargando = true;
    this.clienteService.obtenerClientes().subscribe({
      next: (data: any) => {
        this.clientes = data.items || data; // Ajusta según la estructura de respuesta
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.cargando = false;
      }
    });
  }
}
```

### Ejemplo 2: Crear Cliente
```typescript
crearCliente(cliente: any) {
  this.clienteService.crearCliente(cliente).subscribe({
    next: (response) => {
      console.log('Cliente creado:', response);
      this.cargarClientes(); // Recargar lista
    },
    error: (error) => console.error('Error al crear cliente:', error)
  });
}
```

### Ejemplo 3: Actualizar Cliente
```typescript
actualizarCliente(id: number, cliente: any) {
  this.clienteService.actualizarCliente(id, cliente).subscribe({
    next: (response) => {
      console.log('Cliente actualizado:', response);
      this.cargarClientes(); // Recargar lista
    },
    error: (error) => console.error('Error al actualizar cliente:', error)
  });
}
```

### Ejemplo 4: Eliminar Cliente
```typescript
eliminarCliente(id: number) {
  if (confirm('¿Estás seguro?')) {
    this.clienteService.eliminarCliente(id).subscribe({
      next: () => {
        console.log('Cliente eliminado');
        this.cargarClientes(); // Recargar lista
      },
      error: (error) => console.error('Error al eliminar cliente:', error)
    });
  }
}
```

---

## 4. Asegurar que HttpClientModule está disponible

Verifica que en tu módulo principal (`app.module.ts` o `app.config.ts`) tengas importado `HttpClientModule`:

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule, // ← Agregar esto
    // otros imports...
  ],
  // ...
})
export class AppModule { }
```

O en Angular 15+ (standalone):
```typescript
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // ← O esto si usas provideHttpClient
    // otros providers...
  ]
};
```

---

## 5. Estructura de Datos esperada del Backend

### Cliente
```json
{
  "id_cliente": 1,
  "rut": "12345678-9",
  "nombre_razon": "Nombre del Cliente",
  "email": "cliente@example.com",
  "telefono": "+56912345678",
  "direccion": "Calle Principal 123",
  "ciudad": "Santiago"
}
```

### Medidor
```json
{
  "id_medidor": 1,
  "codigo_medidor": "MED-001",
  "cliente_id": 1,
  "direccion_suministro": "Calle Secundaria 456",
  "estado": true,
  "fecha_instalacion": "2024-01-01T00:00:00",
  "cliente": { /* datos del cliente */ }
}
```

### Lectura
```json
{
  "id_lectura": 1,
  "medidor_id": 1,
  "lectura_kw": 1234.56,
  "fecha_lectura": "2024-11-11T10:30:00",
  "operador": "Juan Pérez"
}
```

### Boleta
```json
{
  "id_boleta": 1,
  "cliente_id": 1,
  "mes": 11,
  "anio": 2024,
  "consumo_kwh": 500,
  "valor_unitario": 650,
  "total": 325000,
  "fecha_emision": "2024-11-11T00:00:00"
}
```

---

## 6. Manejo de Errores

Siempre maneja errores HTTP en tus servicios:

```typescript
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

obtenerClientes(): Observable<any> {
  return this.http.get<any>(this.apiUrl).pipe(
    catchError(error => {
      console.error('Error en obtenerClientes:', error);
      return throwError(() => new Error('No se pudieron cargar los clientes'));
    })
  );
}
```

---

## 7. Cómo ejecutar localmente

### Backend (FastAPI)
```bash
cd /ruta/a/backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
# API disponible en http://localhost:8000
```

### Frontend (Angular)
```bash
cd /ruta/a/frontend/cgefront
npm install
ng serve
# Frontend disponible en http://localhost:4200
```

**Nota**: El backend debe estar ejecutándose antes de iniciar el frontend para que las llamadas HTTP funcionen correctamente.

---

## 8. Troubleshooting

### Error: "CORS error" o "Access to XMLHttpRequest blocked"
- Verifica que el backend tiene CORS habilitado (ver `main.py`)
- Asegúrate que la URL base del frontend es correcta en los servicios

### Error: "404 Not Found"
- Verifica que la ruta del endpoint es correcta (por ejemplo, `/api/clientes/` vs `/clientes/`)
- Comprueba que el backend está ejecutándose en el puerto correcto

### Error: "Network error"
- Verifica que el backend está corriendo (escucha en http://localhost:8000)
- Abre http://localhost:8000 en el navegador para comprobar que responde

---

## 9. Integración con Componentes Existentes

Si tienes componentes como `ListarMedidoresComponent`, asegúrate de:

1. **Inyectar el servicio**:
```typescript
constructor(private medidoresService: MedidoresService) {}
```

2. **Llamar al servicio en `ngOnInit`**:
```typescript
ngOnInit() {
  this.cargarMedidores();
}

cargarMedidores() {
  this.medidoresService.obtenerMedidores().subscribe({
    next: (data) => this.medidores = data,
    error: (error) => console.error('Error:', error)
  });
}
```

3. **Usar los datos en el template**:
```html
<tr *ngFor="let m of medidores">
  <td>{{ m.codigo_medidor }}</td>
  <td>{{ m.cliente?.nombre_razon }}</td>
  <!-- ... -->
</tr>
```

---

¡Ahora tu frontend está completamente conectado con el backend FastAPI!
