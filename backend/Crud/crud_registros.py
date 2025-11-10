from sqlalchemy.orm import Session
from .. import models, schemas
from . import crud_clientes, crud_medidores, crud_lecturas, crud_boletas

def create_registro_completo(db: Session, data: schemas.RegistroCreate):
    """
    Crea un registro completo: cliente, medidor, lectura y boleta
    """
    # 1. Crear cliente
    cliente = crud_clientes.create_cliente(db, data.cliente)
    
    # 2. Crear medidor (asociado al cliente recién creado)
    medidor_data = data.medidor.model_copy()
    medidor_data.id_cliente = cliente.id_cliente
    medidor = crud_medidores.create_medidor(db, medidor_data)
    
    # 3. Crear lectura (asociada al medidor recién creado)
    lectura_data = data.lectura.model_copy()
    lectura_data.id_medidor = medidor.id_medidor
    lectura = crud_lecturas.create_lectura(db, lectura_data)
    
    # 4. Crear boleta (asociada al cliente)
    boleta_data = data.boleta.model_copy()
    boleta_data.id_cliente = cliente.id_cliente
    boleta = crud_boletas.create_boleta(db, boleta_data)
    
    return {
        "cliente": cliente,
        "medidor": medidor,
        "lectura": lectura,
        "boleta": boleta
    }

def get_registro_completo_por_cliente(db: Session, cliente_id: int):
    """
    Obtiene todos los datos relacionados con un cliente
    """
    cliente = crud_clientes.get_cliente(db, cliente_id)
    if not cliente:
        return None
    
    medidores = db.query(models.Medidor).filter(models.Medidor.id_cliente == cliente_id).all()
    boletas = db.query(models.Boleta).filter(models.Boleta.id_cliente == cliente_id).all()
    
    # Obtener lecturas de todos los medidores del cliente
    medidor_ids = [medidor.id_medidor for medidor in medidores]
    lecturas = db.query(models.LecturaConsumo).filter(
        models.LecturaConsumo.id_medidor.in_(medidor_ids)
    ).all() if medidor_ids else []
    
    return {
        "cliente": cliente,
        "medidores": medidores,
        "lecturas": lecturas,
        "boletas": boletas
    }