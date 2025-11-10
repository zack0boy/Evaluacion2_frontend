from sqlalchemy.orm import Session
from sqlalchemy import select
from .. import models, schemas


def create_registro(db:Session, data: schemas.registroCreate) -> models.Resgisro:
    obj = models.Registro(
        #datos medidor 
        codigo_medidor = data.Medidor.codigo_medidor,
        id_cliente = data.Medidor.id_cliente,
        direccion_suministro = data.Medidor.direccion_suministro,
        estado = data.Medidor.estado
   )        
              
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_Registro(db:Session,registro_id: int) -> models.Registro | None:
    return db.get(models.Registro)

def list_registro(db: Session) -> list[models.Registro]:
        return db.get(models.Registro).all()

def delete_registro(db: Session, registro_id: int) -> bool:
    obj = db.get(models.Registro,registro_id)
    
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True