from sqlalchemy.orm import Session
from .. import models, schemas

def create_lectura(db: Session, data: schemas.LecturaConsumoCreate) -> models.LecturaConsumo:
    obj = models.LecturaConsumo(
        id_medidor=data.id_medidor,
        anio=data.anio,
        mes=data.mes,
        lectura_kwh=data.lectura_kwh,
        observacion=data.observacion
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_lectura(db: Session, lectura_id: int) -> models.LecturaConsumo:
    return db.get(models.LecturaConsumo, lectura_id)

def list_lecturas(db: Session):
    return db.query(models.LecturaConsumo).all()

def delete_lectura(db: Session, lectura_id: int) -> bool:
    obj = db.get(models.LecturaConsumo, lectura_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True