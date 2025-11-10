from pydantic import BaseModel, EmailStr, constr
from typing import Optional, Annotated
from decimal import Decimal

# ==========================================================
# CLIENTE
# ==========================================================

class ClienteBase(BaseModel):
    rut: Annotated[str, constr(strip_whitespace=True, min_length=8, max_length=12)]
    nombre_razon: str
    email_contacto: EmailStr
    telefono: Optional[str] = None
    direccion_facturacion: Optional[str] = None
    estado: Optional[str] = "activo"


class ClienteCreate(ClienteBase):
    """Para crear clientes"""
    pass


class ClienteUpdate(BaseModel):
    """Para actualizar clientes"""
    nombre_razon: Optional[str] = None
    email_contacto: Optional[EmailStr] = None
    telefono: Optional[str] = None
    direccion_facturacion: Optional[str] = None
    estado: Optional[str] = None


class ClienteOut(ClienteBase):
    id_cliente: int

    class Config:
        orm_mode = True


# ==========================================================
# MEDIDOR
# ==========================================================

class MedidorBase(BaseModel):
    codigo_medidor: str
    id_cliente: int
    direccion_suministro: Optional[str] = None
    estado: Optional[str] = "activo"


class MedidorCreate(MedidorBase):
    pass


class MedidorOut(MedidorBase):
    id_medidor: int

    class Config:
        orm_mode = True


# ==========================================================
# LECTURA CONSUMO
# ==========================================================

class LecturaConsumoBase(BaseModel):
    id_medidor: int
    anio: int
    mes: int
    lectura_kwh: int
    observacion: Optional[str] = None


class LecturaConsumoCreate(LecturaConsumoBase):
    pass


class LecturaConsumoOut(LecturaConsumoBase):
    id_lectura: int

    class Config:
        orm_mode = True


# ==========================================================
# BOLETA
# ==========================================================

class BoletaBase(BaseModel):
    id_cliente: int
    anio: int
    mes: int
    kwh_total: Decimal
    tarifa_base: Decimal
    cargos: Optional[Decimal] = Decimal("0.00")
    iva: Decimal
    total_pagar: Decimal
    estado: Optional[str] = "emitida"


class BoletaCreate(BoletaBase):
    pass


class BoletaOut(BoletaBase):
    id_boleta: int

    class Config:
        orm_mode = True


# ==========================================================
# REGISTRO (estructura completa de entrada/salida)
# ==========================================================

class RegistroCreate(BaseModel):
    cliente: ClienteCreate
    medidor: MedidorCreate
    lectura: LecturaConsumoCreate
    boleta: BoletaCreate


class RegistroOut(BaseModel):
    cliente: ClienteOut
    medidor: MedidorOut
    lectura: LecturaConsumoOut
    boleta: BoletaOut
