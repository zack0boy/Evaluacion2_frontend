from pydantic import BaseModel
from typing import Optional

# Esquema base
class PersonalesBase(BaseModel):
    nombre: str
    apellidoPaterno: str
    apellidoMaterno: str
    telefono: str
    region: str
    comuna: str


# Esquema para crear un nuevo registro (entrada)
class PersonalesCreate(PersonalesBase):
    pass


# Esquema para devolver datos (salida)
class Personales(PersonalesBase):
    id: int

    class Config:
        orm_mode = True
