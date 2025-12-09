from sqlalchemy.orm import Session
from .. import models, schemas


# =======================================================
#                   CREAR MEDIDOR
# =======================================================
def create_medidor(db: Session, data: schemas.MedidorCreate) -> models.Medidor:
    # Verificar si ya existe el código
    existing = db.query(models.Medidor).filter(
        models.Medidor.codigo_medidor == data.codigo_medidor
    ).first()

    if existing:
        raise ValueError("El código de medidor ya está registrado")

    # Buscar cliente por RUT (NO por ID)
    cliente = db.query(models.Cliente).filter(
        models.Cliente.rut == data.rut_cliente
    ).first()

    if not cliente:
        raise ValueError("No existe un cliente con ese RUT")

    # Crear el medidor
    obj = models.Medidor(
        codigo_medidor=data.codigo_medidor,
        id_cliente=cliente.id_cliente,     # Se asigna automáticamente
        direccion_suministro=data.direccion_suministro,
        estado=data.estado,
        latitud=data.latitud,
        longitud=data.longitud
    )

    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# =======================================================
#                   OBTENER MEDIDOR
# =======================================================
def get_medidor(db: Session, medidor_id: int) -> models.Medidor:
    return db.query(models.Medidor).filter(
        models.Medidor.id_medidor == medidor_id
    ).first()


# =======================================================
#                   LISTAR MEDIDORES
# =======================================================
def list_medidores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Medidor).offset(skip).limit(limit).all()


# =======================================================
#               MEDIDORES POR CLIENTE (RUT)
# =======================================================
def get_medidores_por_cliente(db: Session, rut_cliente: str):
    cliente = db.query(models.Cliente).filter(
        models.Cliente.rut == rut_cliente
    ).first()

    if not cliente:
        return []

    return db.query(models.Medidor).filter(
        models.Medidor.id_cliente == cliente.id_cliente
    ).all()


# =======================================================
#                   ACTUALIZAR MEDIDOR
# =======================================================
def update_medidor(db: Session, medidor_id: int, data: schemas.MedidorUpdate) -> models.Medidor:
    obj = db.query(models.Medidor).filter(
        models.Medidor.id_medidor == medidor_id
    ).first()

    if not obj:
        return None

    update_data = data.dict(exclude_unset=True)

    # Si incluye rut, reasignar cliente
    if "rut_cliente" in update_data:
        cliente = db.query(models.Cliente).filter(
            models.Cliente.rut == update_data["rut_cliente"]
        ).first()

        if not cliente:
            raise ValueError("El RUT ingresado no corresponde a ningún cliente")

        obj.id_cliente = cliente.id_cliente
        del update_data["rut_cliente"]

    # Actualizar los demás campos
    for field, value in update_data.items():
        setattr(obj, field, value)

    db.commit()
    db.refresh(obj)
    return obj


# =======================================================
#                   ELIMINAR MEDIDOR
# =======================================================
def delete_medidor(db: Session, medidor_id: int) -> bool:
    obj = db.query(models.Medidor).filter(
        models.Medidor.id_medidor == medidor_id
    ).first()

    if not obj:
        return False

    db.delete(obj)
    db.commit()
    return True
