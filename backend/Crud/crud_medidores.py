from sqlalchemy.orm import Session
from .. import models, schemas

def create_medidor(db: Session, data: schemas.MedidorCreate) -> models.Medidor:
    # Verificar si el código de medidor ya existe
    existing = db.query(models.Medidor).filter(models.Medidor.codigo_medidor == data.codigo_medidor).first()
    if existing:
        raise ValueError("El código de medidor ya está registrado")
    
    # Verificar que el cliente existe
    cliente = db.query(models.Cliente).filter(models.Cliente.id_cliente == data.id_cliente).first()
    if not cliente:
        raise ValueError("El cliente especificado no existe")
    
    obj = models.Medidor(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_medidor(db: Session, medidor_id: int) -> models.Medidor:
    return db.query(models.Medidor).filter(models.Medidor.id_medidor == medidor_id).first()

def list_medidores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Medidor).offset(skip).limit(limit).all()

def get_medidores_por_cliente(db: Session, cliente_id: int):
    return db.query(models.Medidor).filter(models.Medidor.id_cliente == cliente_id).all()

def update_medidor(db: Session, medidor_id: int, data: schemas.MedidorUpdate) -> models.Medidor:
    obj = db.query(models.Medidor).filter(models.Medidor.id_medidor == medidor_id).first()
    if not obj:
        return None
    
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(obj, field, value)
    
    db.commit()
    db.refresh(obj)
    return obj

def delete_medidor(db: Session, medidor_id: int) -> bool:
    obj = db.query(models.Medidor).filter(models.Medidor.id_medidor == medidor_id).first()
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True