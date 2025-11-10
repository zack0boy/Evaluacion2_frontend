from sqlalchemy.orm import Session
from .. import models, schemas

# Crear cliente
def create_cliente(db: Session, data: schemas.ClienteCreate) -> models.Cliente:
    obj = models.Cliente(
        rut=data.rut,
        nombre_razon=data.nombre_razon,
        email_contacto=data.email_contacto,
        telefono=data.telefono,
        direccion_facturacion=data.direccion_facturacion,
        estado=data.estado
    )

    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

# Obtener cliente por ID
def get_cliente(db: Session, cliente_id: int) -> models.Cliente:
    return db.get(models.Cliente, cliente_id)

# Listar todos los clientes
def list_clientes(db: Session):
    return db.query(models.Cliente).all()

# Eliminar cliente por ID
def delete_cliente(db: Session, cliente_id: int) -> bool:
    obj = db.get(models.Cliente, cliente_id)
    if not obj:
        return False

    db.delete(obj)
    db.commit()
    return True

# Actualizar cliente
def update_cliente(db: Session, cliente_id: int, data: schemas.ClienteUpdate) -> models.Cliente:
    obj = db.get(models.Cliente, cliente_id)
    if not obj:
        return None
    
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(obj, field, value)
    
    db.commit()
    db.refresh(obj)
    return obj