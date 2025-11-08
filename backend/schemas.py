from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from decimal import Decimal

# CLIENTE


class ClienteBase(BaseModel):
    rut: constr(strip_whitespace=True, min_length=8, max_length=12)
    nombre_razon: str
    email_contacto: EmailStr
    telefono: Optional[str] = None
    direccion_facturacion: Optional[str] = None
    estado: Optional[str] = "activo"


class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(BaseModel):
    nombre_razon: Optional[str] = None
    email_contacto: Optional[EmailStr] = None
    telefono: Optional[str] = None
    direccion_facturacion: Optional[str] = None
    estado: Optional[str] = None


class ClienteResponse(ClienteBase):
    id_cliente: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        orm_mode = True


# MEDIDOR


class MedidorBase(BaseModel):
    codigo_medidor: str
    id_cliente: int
    direccion_suministro: Optional[str] = None
    estado: Optional[str] = "activo"


class MedidorCreate(MedidorBase):
    pass


class MedidorResponse(MedidorBase):
    id_medidor: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        orm_mode = True



# LECTURA CONSUMO


class LecturaConsumoBase(BaseModel):
    id_medidor: int
    anio: int
    mes: int
    lectura_kwh: int
    observacion: Optional[str] = None


class LecturaConsumoCreate(LecturaConsumoBase):
    pass


class LecturaConsumoResponse(LecturaConsumoBase):
    id_lectura: int
    created_at: Optional[str] = None

    class Config:
        orm_mode = True


# BOLETA


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


class BoletaResponse(BoletaBase):
    id_boleta: int
    created_at: Optional[str] = None

    class Config:
        orm_mode = True

