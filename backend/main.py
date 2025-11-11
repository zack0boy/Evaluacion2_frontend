from typing import List
from fastapi import FastAPI, status, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from . import schemas
from .Crud import crud_clientes, crud_medidores, crud_correo, crud_boletas, crud_lecturas

# Crear las tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Gestión de Clientes y Medidores",
    description="API para gestión de clientes y medidores"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "API de gestión de clientes y medidores funcionando correctamente"}

# =======================
# CLIENTES (CRUD COMPLETO)
# =======================

@app.post("/api/clientes/", response_model=schemas.ClienteOut, tags=["Clientes"])
def crear_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    """
    Crear un nuevo cliente
    """
    try:
        return crud_clientes.create_cliente(db, cliente)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/clientes/", response_model=schemas.PaginatedResponse, tags=["Clientes"])
def buscar_clientes(
    rut: str = Query(None),
    nombre_razon: str = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Buscar clientes con paginación
    """
    search = schemas.ClienteSearch(
        rut=rut,
        nombre_razon=nombre_razon,
        page=page,
        limit=limit
    )
    return crud_clientes.search_clientes(db, search)

@app.get("/api/clientes/{cliente_id}", response_model=schemas.ClienteOut, tags=["Clientes"])
def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """
    Obtener un cliente por ID
    """
    cliente = crud_clientes.get_cliente(db, cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

@app.put("/api/clientes/{cliente_id}", response_model=schemas.ClienteOut, tags=["Clientes"])
def actualizar_cliente(cliente_id: int, cliente: schemas.ClienteUpdate, db: Session = Depends(get_db)):
    """
    Actualizar un cliente existente
    """
    updated = crud_clientes.update_cliente(db, cliente_id, cliente)
    if not updated:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return updated

@app.delete("/api/clientes/{cliente_id}", tags=["Clientes"])
def eliminar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """
    Eliminar un cliente
    """
    success = crud_clientes.delete_cliente(db, cliente_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return {"message": "Cliente eliminado correctamente"}

# =======================
# MEDIDORES (CRUD COMPLETO)
# =======================

@app.post("/api/medidores/", response_model=schemas.MedidorOut, tags=["Medidores"])
def crear_medidor(medidor: schemas.MedidorCreate, db: Session = Depends(get_db)):
    """
    Crear un nuevo medidor asociado a un cliente
    """
    try:
        return crud_medidores.create_medidor(db, medidor)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/medidores/", response_model=List[schemas.MedidorOut], tags=["Medidores"])
def listar_medidores(db: Session = Depends(get_db)):
    """
    Listar todos los medidores
    """
    return crud_medidores.list_medidores(db)

@app.get("/api/medidores/{medidor_id}", response_model=schemas.MedidorOut, tags=["Medidores"])
def obtener_medidor(medidor_id: int, db: Session = Depends(get_db)):
    """
    Obtener un medidor por ID
    """
    medidor = crud_medidores.get_medidor(db, medidor_id)
    if not medidor:
        raise HTTPException(status_code=404, detail="Medidor no encontrado")
    return medidor

@app.put("/api/medidores/{medidor_id}", response_model=schemas.MedidorOut, tags=["Medidores"])
def actualizar_medidor(medidor_id: int, medidor: schemas.MedidorUpdate, db: Session = Depends(get_db)):
    """
    Actualizar un medidor existente
    """
    updated = crud_medidores.update_medidor(db, medidor_id, medidor)
    if not updated:
        raise HTTPException(status_code=404, detail="Medidor no encontrado")
    return updated

@app.delete("/api/medidores/{medidor_id}", tags=["Medidores"])
def eliminar_medidor(medidor_id: int, db: Session = Depends(get_db)):
    """
    Eliminar un medidor
    """
    success = crud_medidores.delete_medidor(db, medidor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Medidor no encontrado")
    return {"message": "Medidor eliminado correctamente"}

@app.get("/api/medidores/cliente/{cliente_id}", response_model=List[schemas.MedidorOut], tags=["Medidores"])
def listar_medidores_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """
    Listar todos los medidores de un cliente específico
    """
    return crud_medidores.get_medidores_por_cliente(db, cliente_id)

# =======================
# LECTURAS (crear/listar por medidor/mes)
# =======================

@app.post("/api/lecturas/", response_model=schemas.LecturaConsumoOut, tags=["Lecturas"])
def crear_lectura(lectura: schemas.LecturaConsumoCreate, db: Session = Depends(get_db)):
    """
    Crear una nueva lectura de consumo
    """
    try:
        return crud_lecturas.create_lectura(db, lectura)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/lecturas/medidor/{medidor_id}", response_model=List[schemas.LecturaConsumoOut], tags=["Lecturas"])
def listar_lecturas_medidor(medidor_id: int, db: Session = Depends(get_db)):
    """
    Listar lecturas por medidor
    """
    return crud_lecturas.get_lecturas_por_medidor(db, medidor_id)

# =======================
# BOLETAS (generar/listar por cliente/mes)
# =======================

@app.post("/api/boletas/", response_model=schemas.BoletaOut, tags=["Boletas"])
def crear_boleta(boleta: schemas.BoletaCreate, db: Session = Depends(get_db)):
    """
    Generar una nueva boleta
    """
    try:
        return crud_boletas.create_boleta(db, boleta)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/boletas/cliente/{cliente_id}", response_model=List[schemas.BoletaOut], tags=["Boletas"])
def listar_boletas_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """
    Listar boletas por cliente
    """
    return crud_boletas.get_boletas_por_cliente(db, cliente_id)

@app.get("/api/boletas/mes/{anio}/{mes}", response_model=List[schemas.BoletaOut], tags=["Boletas"])
def listar_boletas_mes(anio: int, mes: int, db: Session = Depends(get_db)):
    """
    Listar boletas por mes y año
    """
    return crud_boletas.get_boletas_por_mes(db, anio, mes)

# =======================
# CORREO    
# =======================

@app.get("/correo/boleta/{boleta_id}/datos", tags=["Correo"])
def obtener_datos_boleta_para_correo(boleta_id: int, db: Session = Depends(get_db)):
    """
    Obtener datos de boleta para que el frontend genere el HTML del correo
    """
    try:
        datos = crud_correo.obtener_datos_boleta_para_correo(db, boleta_id)
        return {
            "success": True,
            "data": datos
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo datos: {str(e)}")

@app.post("/correo/boleta/{boleta_id}/enviar", tags=["Correo"])
def enviar_boleta_por_correo(
    boleta_id: int, 
    request: schemas.CorreoEnvioRequest,  # Nuevo esquema
    db: Session = Depends(get_db)
):
    """
    Enviar boleta por correo con HTML generado desde el frontend
    """
    try:
        # Primero verificar que la boleta existe
        boleta = crud_boletas.get_boleta(db, boleta_id)
        if not boleta:
            raise HTTPException(status_code=404, detail="Boleta no encontrada")
        
        # Usar la versión simulada para desarrollo
        # Para producción: crud_correo.enviar_correo_con_html
        success = crud_correo.enviar_correo_con_html_simulado(
            external_html=request.html_content,
            email_destino=request.email_destino,
            asunto=request.asunto or f"Boleta de Servicio - {boleta.mes}/{boleta.anio}"
        )
        
        if success:
            return {
                "message": f"Boleta {boleta_id} enviada exitosamente a {request.email_destino}",
                "enviado": True
            }
        else:
            raise HTTPException(status_code=500, detail="Error al enviar el correo")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al enviar correo: {str(e)}")