from sqlalchemy.orm import Session
from .. import models, schemas

def create_boleta(db: Session, data: schemas.BoletaCreate) -> models.Boleta:
    obj = models.Boleta(
        id_cliente=data.id_cliente,
        anio=data.anio,
        mes=data.mes,
        kwh_total=data.kwh_total,
        tarifa_base=data.tarifa_base,
        cargos=data.cargos,
        iva=data.iva,
        total_pagar=data.total_pagar,
        estado=data.estado
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_boleta(db: Session, boleta_id: int) -> models.Boleta:
    return db.get(models.Boleta, boleta_id)

def list_boletas(db: Session):
    return db.query(models.Boleta).all()

def delete_boleta(db: Session, boleta_id: int) -> bool:
    obj = db.get(models.Boleta, boleta_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True