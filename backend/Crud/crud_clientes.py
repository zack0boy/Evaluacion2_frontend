from sqlalchemy.orm import Session
from sqlalchemy import or_
from .. import models, schemas

def create_cliente(db: Session, data: schemas.ClienteCreate) -> models.Cliente:
    # Verificar si el RUT ya existe
    existing = db.query(models.Cliente).filter(models.Cliente.rut == data.rut).first()
    if existing:
        raise ValueError("El RUT ya está registrado")
    
    obj = models.Cliente(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_cliente(db: Session, cliente_id: int) -> models.Cliente:
    return db.query(models.Cliente).filter(models.Cliente.id_cliente == cliente_id).first()

def search_clientes(db: Session, search: schemas.ClienteSearch):
    query = db.query(models.Cliente)
    
    if search.rut:
        query = query.filter(models.Cliente.rut.contains(search.rut))
    if search.nombre_razon:
        query = query.filter(models.Cliente.nombre_razon.contains(search.nombre_razon))
    
    total = query.count()
    items = query.offset((search.page - 1) * search.limit).limit(search.limit).all()
    
    return {
        "page": search.page,
        "limit": search.limit,
        "total": total,
        "items": items
    }

def list_clientes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Cliente).offset(skip).limit(limit).all()

def update_cliente(db: Session, cliente_id: int, data: schemas.ClienteUpdate) -> models.Cliente:
    obj = db.query(models.Cliente).filter(models.Cliente.id_cliente == cliente_id).first()
    if not obj:
        return None
    
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(obj, field, value)
    
    db.commit()
    db.refresh(obj)
    return obj

def delete_cliente(db: Session, cliente_id: int) -> bool:
    obj = db.query(models.Cliente).filter(models.Cliente.id_cliente == cliente_id).first()
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True