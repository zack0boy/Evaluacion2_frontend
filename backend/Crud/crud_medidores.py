from sqlalchemy.orm import Session
from .. import models, schemas

def create_medidor(db: Session, data: schemas.MedidorCreate) -> models.Medidor:
    obj = models.Medidor(
        codigo_medidor=data.codigo_medidor,
        id_cliente=data.id_cliente,
        direccion_suministro=data.direccion_suministro,
        estado=data.estado
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_medidor(db: Session, medidor_id: int) -> models.Medidor:
    return db.get(models.Medidor, medidor_id)

def list_medidores(db: Session):
    return db.query(models.Medidor).all()

def delete_medidor(db: Session, medidor_id: int) -> bool:
    obj = db.get(models.Medidor, medidor_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True