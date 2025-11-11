from sqlalchemy.orm import Session
from fastapi import HTTPException
import models, schemas
from decimal import Decimal

def create_boleta(db: Session, data: schemas.BoletaCreate):
    """
    Crear una nueva boleta, validando que no exista otra para el mismo cliente/mes/año
    """
    existente = db.query(models.Boleta).filter(
        models.Boleta.id_cliente == data.id_cliente,
        models.Boleta.anio == data.anio,
        models.Boleta.mes == data.mes
    ).first()

    if existente:
        raise ValueError("Ya existe una boleta para este cliente y mes")

    # Calcular total automáticamente si no viene
    if not data.total_pagar:
        # Convertir a Decimal y asegurar que no sean None
        kwh = Decimal(str(data.kwh_total or 0))
        tarifa = Decimal(str(data.tarifa_base or 0))
        cargos = Decimal(str(data.cargos or 0))

        subtotal = kwh * tarifa + cargos
        iva = subtotal * Decimal("0.19")
        data.total_pagar = subtotal + iva
        data.iva = iva

    nueva_boleta = models.Boleta(**data.dict())
    db.add(nueva_boleta)
    db.commit()
    db.refresh(nueva_boleta)
    return nueva_boleta


def get_boletas_por_cliente(db: Session, id_cliente: int):
    """
    Listar todas las boletas de un cliente específico
    """
    return db.query(models.Boleta).filter(models.Boleta.id_cliente == id_cliente).all()


def get_boletas_por_mes(db: Session, anio: int, mes: int):
    """
    Listar boletas por mes y año
    """
    return db.query(models.Boleta).filter(
        models.Boleta.anio == anio,
        models.Boleta.mes == mes
    ).all()


def get_boleta(db: Session, boleta_id: int):
    """
    Obtener una boleta por ID
    """
    return db.query(models.Boleta).filter(models.Boleta.id_boleta == boleta_id).first()


def delete_boleta(db: Session, boleta_id: int):
    """
    Eliminar una boleta por ID
    """
    boleta = db.query(models.Boleta).filter(models.Boleta.id_boleta == boleta_id).first()
    if not boleta:
        raise HTTPException(status_code=404, detail="Boleta no encontrada")

    db.delete(boleta)
    db.commit()
    return {"message": "Boleta eliminada correctamente"}
