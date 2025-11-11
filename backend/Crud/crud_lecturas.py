from sqlalchemy.orm import Session
from .. import models, schemas

def create_lectura(db: Session, data: schemas.LecturaConsumoCreate) -> models.LecturaConsumo:
    # Verificar si ya existe lectura para ese mes/año
    existing = db.query(models.LecturaConsumo).filter(
        models.LecturaConsumo.id_medidor == data.id_medidor,
        models.LecturaConsumo.anio == data.anio,
        models.LecturaConsumo.mes == data.mes
    ).first()
    
    if existing:
        raise ValueError("Ya existe una lectura para este medidor en el mes y año especificados")
    
    # Calcular consumo (buscar lectura anterior)
    lectura_anterior = db.query(models.LecturaConsumo).filter(
        models.LecturaConsumo.id_medidor == data.id_medidor
    ).order_by(models.LecturaConsumo.anio.desc(), models.LecturaConsumo.mes.desc()).first()
    
    consumo_kwh = data.lectura_kwh
    if lectura_anterior:
        consumo_kwh = data.lectura_kwh - lectura_anterior.lectura_kwh
        if consumo_kwh < 0:
            raise ValueError("La lectura actual no puede ser menor que la anterior")
    
    obj = models.LecturaConsumo(
        **data.dict(),
        consumo_kwh=consumo_kwh
    )
    
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_lecturas_por_medidor(db: Session, medidor_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.LecturaConsumo).filter(
        models.LecturaConsumo.id_medidor == medidor_id
    ).order_by(models.LecturaConsumo.anio.desc(), models.LecturaConsumo.mes.desc()).offset(skip).limit(limit).all()

def get_lectura(db: Session, lectura_id: int) -> models.LecturaConsumo:
    return db.query(models.LecturaConsumo).filter(models.LecturaConsumo.id_lectura == lectura_id).first()

def get_lecturas_por_mes(db: Session, anio: int, mes: int):
    return db.query(models.LecturaConsumo).filter(
        models.LecturaConsumo.anio == anio,
        models.LecturaConsumo.mes == mes
    ).order_by(models.LecturaConsumo.id_medidor.asc()).all()
