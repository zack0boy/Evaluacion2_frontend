# Guía: Gestión de Clientes Completa (Frontend + Backend)

## Resumen

He implementado un sistema completo de gestión de clientes con:
- ✅ Listar clientes con búsqueda/filtrado
- ✅ Crear nuevo cliente
- ✅ Editar cliente existente
- ✅ Eliminar cliente
- ✅ Validación de datos
- ✅ Manejo de errores

---

## 1. Rutas configuradas

### En `clientes-routing.module.ts`
```typescript
const routes: Routes = [
  { path: '', component: ListarClientesComponent },
  { path: 'nuevo', component: ClienteFormComponent },
  { path: 'editar/:id', component: ClienteFormComponent },
  { path: ':id', component: ClienteDetailComponent },
];
```

### En `app.routes.ts`
```typescript
{ path: 'nuevo', redirectTo: 'clientes/nuevo' },  // Atajo rápido
{ path: 'clientes', loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule) },
```

### Acceder a:
- Listado: `http://localhost:4200/clientes`
- Nuevo: `http://localhost:4200/clientes/nuevo` o `/nuevo`
- Editar: `http://localhost:4200/clientes/editar/1`

---

## 2. Componentes implementados

### ListarClientesComponent
**Archivo**: `src/app/clientes/listar-clientes/`

**Funcionalidades**:
- Carga lista de clientes del backend
- Filtrado client-side (RUT, nombre, email)
- Botones para editar y eliminar
- Indicador de cargando

**Código clave**:
```typescript
cargarClientes(): void {
  this.cargando = true;
  this.clienteService.obtenerClientes().subscribe({
    next: (data: any) => {
      this.clientes = data.items || data;
      this.clientesFiltrados = this.clientes;
      this.cargando = false;
    }
  });
}

filtrarClientes(): void {
  const termino = (this.filtro || '').trim().toLowerCase();
  if (!termino) {
    this.clientesFiltrados = this.clientes;
    return;
  }
  this.clientesFiltrados = this.clientes.filter(c =>
    String(c.rut).toLowerCase().includes(termino) ||
    String(c.nombre_razon).toLowerCase().includes(termino) ||
    String(c.email).toLowerCase().includes(termino)
  );
}
```

### ClienteFormComponent
**Archivo**: `src/app/clientes/cliente-form/`

**Funcionalidades**:
- Crear nuevo cliente
- Editar cliente existente (detecta ID en ruta)
- Validación completa de datos
- Manejo de errores

**Datos del formulario**:
```typescript
cliente = {
  rut: '',                  // Ej: 12345678-9
  nombre_razon: '',         // Ej: Mi Empresa S.A.
  email: '',                // Ej: info@empresa.com
  telefono: '',             // Opcional
  direccion: '',            // Ej: Calle Principal 123
  ciudad: ''                // Opcional
};
```

**Validaciones**:
- RUT requerido
- Nombre/Razón Social requerido
- Email requerido y con formato válido (user@domain.com)
- Dirección requerida
- Teléfono y ciudad opcionales

**Código clave - Crear**:
```typescript
guardar(): void {
  if (!this.validar()) return;
  
  this.cargando = true;
  
  if (this.modoEdicion && this.clienteId) {
    // Actualizar
    this.clienteService.actualizarCliente(this.clienteId, this.cliente).subscribe({
      next: (respuesta) => {
        alert('Cliente actualizado correctamente');
        this.router.navigate(['/clientes']);
      },
      error: (error) => {
        this.mensajeError = error.error?.detail || 'Error al actualizar';
      }
    });
  } else {
    // Crear
    this.clienteService.crearCliente(this.cliente).subscribe({
      next: (respuesta) => {
        alert(`Cliente "${respuesta.nombre_razon}" creado correctamente`);
        this.router.navigate(['/clientes']);
      },
      error: (error) => {
        this.mensajeError = error.error?.detail || 'Error al crear';
      }
    });
  }
}
```

---

## 3. Servicio (ClienteService)

**Archivo**: `src/app/clientes/clientes.service.ts`

Métodos disponibles:

```typescript
// Obtener todos los clientes (con paginación opcional)
obtenerClientes(rut?: string, nombre?: string, page: number = 1, limit: number = 10): Observable<any>

// Obtener cliente por ID
obtenerClientePorId(id: number): Observable<any>

// Crear nuevo cliente
crearCliente(cliente: any): Observable<any>

// Actualizar cliente existente
actualizarCliente(id: number, cliente: any): Observable<any>

// Eliminar cliente
eliminarCliente(id: number): Observable<any>
```

---

## 4. API Endpoints (Backend)

Los endpoints están implementados en `backend/main.py`:

```python
# POST: Crear cliente
POST /api/clientes/
Body: { rut, nombre_razon, email, telefono, direccion, ciudad }

# GET: Listar clientes
GET /api/clientes/?rut=X&nombre_razon=Y&page=1&limit=10

# GET: Obtener cliente por ID
GET /api/clientes/{cliente_id}

# PUT: Actualizar cliente
PUT /api/clientes/{cliente_id}
Body: { rut, nombre_razon, email, telefono, direccion, ciudad }

# DELETE: Eliminar cliente
DELETE /api/clientes/{cliente_id}
```

---

## 5. Flujo Completo: Crear Cliente

### 1. Usuario llena formulario
```html
<input [(ngModel)]="cliente.rut" name="rut" />
<input [(ngModel)]="cliente.nombre_razon" name="nombre_razon" />
<input [(ngModel)]="cliente.email" name="email" />
<input [(ngModel)]="cliente.telefono" name="telefono" />
<input [(ngModel)]="cliente.direccion" name="direccion" />
<input [(ngModel)]="cliente.ciudad" name="ciudad" />
<button (click)="guardar()">Crear</button>
```

### 2. Componente valida
```typescript
validar(): boolean {
  if (!this.cliente.rut.trim()) {
    this.mensajeError = 'El RUT es requerido';
    return false;
  }
  if (!this.validarEmail(this.cliente.email)) {
    this.mensajeError = 'Email inválido';
    return false;
  }
  // ... más validaciones
  return true;
}
```

### 3. Envía al backend
```typescript
this.clienteService.crearCliente(this.cliente).subscribe({...});
```

### 4. Backend procesa
```python
@app.post("/api/clientes/")
def crear_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    return crud_clientes.create_cliente(db, cliente)
```

### 5. Backend valida y almacena
```python
def create_cliente(db: Session, cliente: ClienteCreate):
    # Validar RUT único
    # Validar email único
    # Crear en BD
    # Retornar con ID
```

### 6. Frontend recibe respuesta
```typescript
next: (respuesta) => {
  console.log('ID asignado:', respuesta.id_cliente);
  alert('Cliente creado correctamente');
  this.router.navigate(['/clientes']); // Ir al listado
}
```

### 7. Listado se actualiza
- Usuario ve nuevo cliente en la tabla
- Puede editarlo o eliminarlo

---

## 6. Flujo: Editar Cliente

### 1. Usuario hace clic en "Editar"
```html
<button (click)="editarCliente(c.id_cliente)">Editar</button>
```

### 2. Navega a `/clientes/editar/1`
```typescript
editarCliente(id: number): void {
  this.router.navigate(['/clientes/editar', id]);
}
```

### 3. ClienteFormComponent detecta ID
```typescript
ngOnInit(): void {
  this.route.params.subscribe(params => {
    if (params['id']) {
      this.clienteId = +params['id'];
      this.modoEdicion = true;
      this.cargarClienteParaEditar();
    }
  });
}
```

### 4. Carga datos del cliente
```typescript
cargarClienteParaEditar(): void {
  this.clienteService.obtenerClientePorId(this.clienteId).subscribe({
    next: (data) => {
      this.cliente = data;
    }
  });
}
```

### 5. Formulario se prelena
- Los campos muestran los datos actuales
- El título dice "✏️ Editar Cliente"

### 6. Usuario modifica y hace clic en "Actualizar"
```typescript
if (this.modoEdicion && this.clienteId) {
  this.clienteService.actualizarCliente(this.clienteId, this.cliente).subscribe({...});
}
```

### 7. Vuelve al listado actualizado

---

## 7. Flujo: Eliminar Cliente

### 1. Usuario hace clic en "Eliminar"
```html
<button (click)="eliminarCliente(c.id_cliente)">Eliminar</button>
```

### 2. Se pide confirmación
```typescript
if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
  this.clienteService.eliminarCliente(id).subscribe({...});
}
```

### 3. Se envía DELETE al backend
```
DELETE /api/clientes/1
```

### 4. Backend elimina
```python
@app.delete("/api/clientes/{cliente_id}")
def eliminar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    success = crud_clientes.delete_cliente(db, cliente_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return {"message": "Cliente eliminado correctamente"}
```

### 5. Lista se recarga sin el cliente eliminado

---

## 8. Cómo probar

### Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
# Estará en http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Frontend
```bash
cd frontend/cgefront
ng serve
# Estará en http://localhost:4200
```

### Pruebas
1. Abre http://localhost:4200/clientes
2. Haz clic en "+ Nuevo Cliente"
3. Llena el formulario:
   - RUT: 12345678-9
   - Nombre: Mi Empresa
   - Email: info@empresa.com
   - Teléfono: +56912345678
   - Dirección: Calle Principal 123
   - Ciudad: Santiago
4. Haz clic en "Crear"
5. Deberías ver el nuevo cliente en la lista
6. Prueba "Editar" y "Eliminar"

### Verificar en DevTools
1. Abre F12 → Network
2. Crea un cliente
3. Verás peticiones POST/PUT/DELETE a `http://localhost:8000/api/clientes/`

---

## 9. Estructura completa de carpetas

```
frontend/cgefront/src/app/clientes/
├── clientes-routing.module.ts        # Rutas del módulo
├── clientes.module.ts                # Módulo
├── clientes.service.ts               # Servicio HTTP
├── cliente-form/
│   ├── cliente-form.component.ts     # Crear/Editar
│   ├── cliente-form.component.html   # Formulario
│   └── cliente-form.component.scss   # Estilos
├── cliente-detail/
│   ├── cliente-detail.component.ts   # Ver detalles
│   ├── cliente-detail.component.html
│   └── cliente-detail.component.scss
└── listar-clientes/
    ├── listar-clientes.component.ts   # Listado con búsqueda
    ├── listar-clientes.component.html # Tabla
    └── listar-clientes.component.scss # Estilos
```

---

## 10. Mejoras futuras (opcionales)

- [ ] Agregar paginación en el listado
- [ ] Validación de RUT (algoritmo de validación chileno)
- [ ] Exportar a CSV
- [ ] Importar desde CSV
- [ ] Fotos de clientes
- [ ] Historial de cambios
- [ ] Filtro avanzado
- [ ] Notificaciones con Toastr

---

¡La gestión de clientes está completamente funcional!

**Próximo paso**: ¿Quieres que haga lo mismo para **Boletas**, **Lecturas** u otra entidad?
