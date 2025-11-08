from sqlalchemy.orm import Session
from sqlalchemy import select
from , import models, schemas


def create_registro(db:Session, data: schema.registroCreate) -> models.Resgisro:
    obj = models.Registro(

    )

    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_Registro(db:Session,registro_id: int) -> models.Registro | None:
    return db.get(models.Registro)