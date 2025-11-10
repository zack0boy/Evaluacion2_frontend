from typing import List
from fastapi import FastAPI, status, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from . import schemas
from .Crud import crud_clientes, crud_medidores, crud_lecturas, crud_boletas, crud_registros

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Crear la aplicación FastAPI
app = FastAPI(
    title="Sistema de Gestión de Clientes y Medidores",
    description="API para gestión de clientes, medidores, lecturas y boletas"
)

# =======================
# CONFIGURAR CORS
# =======================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================
# ENDPOINTS
# =======================

@app.get("/")
async def read_root():
    return {"message": "API de gestión de clientes funcionando correctamente"}

# =======================
# ENDPOINTS PARA CLIENTES
# =======================

@app.post(
    "/clientes/",
    response_model=schemas.ClienteOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Clientes"]
)
def crear_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    """
    Crear un nuevo cliente
    """
    try:
        return crud_clientes.create_cliente(db, cliente)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al crear el cliente: {str(e)}")

@app.get(
    "/clientes/",
    response_model=List[schemas.ClienteOut],
    tags=["Clientes"]
)
def listar_clientes(db: Session = Depends(get_db)):
    """
    Obtener todos los clientes
    """
    return crud_clientes.list_clientes(db)

@app.get(
    "/clientes/{cliente_id}",
    response_model=schemas.ClienteOut,
    tags=["Clientes"]
)
def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """
    Obtener un cliente por ID
    """
    cliente = crud_clientes.get_cliente(db, cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

# =======================
# ENDPOINTS PARA MEDIDORES
# =======================

@app.post(
    "/medidores/",
    response_model=schemas.MedidorOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Medidores"]
)
def crear_medidor(medidor: schemas.MedidorCreate, db: Session = Depends(get_db)):
    """
    Crear un nuevo medidor
    """
    try:
        return crud_medidores.create_medidor(db, medidor)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al crear el medidor: {str(e)}")

@app.get(
    "/medidores/",
    response_model=List[schemas.MedidorOut],
    tags=["Medidores"]
)
def listar_medidores(db: Session = Depends(get_db)):
    """
    Obtener todos los medidores
    """
    return crud_medidores.list_medidores(db)

# =======================
# ENDPOINTS PARA LECTURAS
# =======================

@app.post(
    "/lecturas/",
    response_model=schemas.LecturaConsumoOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Lecturas"]
)
def crear_lectura(lectura: schemas.LecturaConsumoCreate, db: Session = Depends(get_db)):
    """
    Crear una nueva lectura de consumo
    """
    try:
        return crud_lecturas.create_lectura(db, lectura)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al crear la lectura: {str(e)}")

# =======================
# ENDPOINTS PARA BOLETAS
# =======================

@app.post(
    "/boletas/",
    response_model=schemas.BoletaOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Boletas"]
)
def crear_boleta(boleta: schemas.BoletaCreate, db: Session = Depends(get_db)):
    """
    Crear una nueva boleta
    """
    try:
        return crud_boletas.create_boleta(db, boleta)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al crear la boleta: {str(e)}")

# =======================
# ENDPOINT PARA REGISTRO COMPLETO
# =======================

@app.post(
    "/registros-completos/",
    status_code=status.HTTP_201_CREATED,
    tags=["Registros Completos"]
)
def crear_registro_completo(registro: schemas.RegistroCreate, db: Session = Depends(get_db)):
    """
    Endpoint para crear un registro completo (cliente, medidor, lectura, boleta) en una sola operación
    """
    try:
        resultado = crud_registros.create_registro_completo(db, registro)
        return {
            "message": "Registro completo creado exitosamente",
            "data": resultado
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al crear el registro completo: {str(e)}")

@app.get(
    "/registros-completos/cliente/{cliente_id}",
    tags=["Registros Completos"]
)
def obtener_registro_completo(cliente_id: int, db: Session = Depends(get_db)):
    """
    Obtener todos los datos relacionados con un cliente específico
    """
    try:
        registro = crud_registros.get_registro_completo_por_cliente(db, cliente_id)
        if not registro:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        return registro
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al obtener el registro: {str(e)}")