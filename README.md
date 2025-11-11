# Evaluacion2_frontend

Sistema de Gestión de Clientes y Medidores

## Descripción
Proyecto fullstack para la gestión de clientes, medidores, lecturas y boletas. Incluye:
- **Frontend:** Angular 16+ (standalone components, Tailwind, Vite)
- **Backend:** FastAPI (Python 3.10+), SQLAlchemy, Pydantic

## Estructura
```
backend/
  main.py           # API FastAPI principal
  database.py       # Configuración de base de datos
  models.py         # Modelos SQLAlchemy
  schemas.py        # Esquemas Pydantic
  Crud/             # Lógica CRUD por entidad
frontend/
  cgefront/
    src/app/        # Componentes Angular
      clientes/     # CRUD clientes
      medidores/    # CRUD medidores
      lecturas/     # CRUD lecturas
      boletas/      # CRUD boletas
      registros/    # Listado y gestión de registros
    environments/   # Configuración de entorno
    ...
```

## Instalación
### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install "fastapi[standard]", SQLAlchemy, Pydantic
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend/cgefront
source venv/bin/activate
npm install
ng serve
```

## Uso
- Accede al frontend en [http://localhost:4200](http://localhost:4200)
- El backend corre en [http://localhost:8000](http://localhost:8000)
- CRUD completo para clientes, medidores, lecturas y boletas
- Filtrado y búsqueda en listados
- Validación de datos y mensajes de error amigables

## Documentación
- Ver archivos `GUIA_*` en la raíz para ejemplos y guías rápidas
- Endpoints principales: `/api/clientes/`, `/api/medidores/`, `/api/lecturas/`, `/api/boletas/`

## Requisitos
- Node.js 18+
- Python 3.10+
- Base de datos SQLite (por defecto)

## Autor
- Gonzalo Castillo
-
-Juan Badilla 

## Licencia
MIT
