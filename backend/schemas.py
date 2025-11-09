from pydantic import BaseModel, EmailStr, constr
from typing import Optional,Annotated
from decimal import Decimal
# CLIENTE


class ClienteBase(BaseModel):
    rut: Annotated[str, constr(strip_whitespace=True, min_length=8, max_length=12)]
    nombre_razon: str
    email_contacto: EmailStr
    telefono: Optional[str] = None
    direccion_facturacion: Optional[str] = None
    estado: Optional[str] = "activo"


class ClienteUpdate(BaseModel):
    nombre_razon: Optional[str] = None
    email_contacto: Optional[EmailStr] = None
    telefono: Optional[str] = None
    direccion_facturacion: Optional[str] = None
    estado: Optional[str] = None



# MEDIDOR


class MedidorBase(BaseModel):
    codigo_medidor: str
    id_cliente: int
    direccion_suministro: Optional[str] = None
    estado: Optional[str] = "activo"





# LECTURA CONSUMO


class LecturaConsumoBase(BaseModel):
    id_medidor: int
    anio: int
    mes: int
    lectura_kwh: int
    observacion: Optional[str] = None



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

class registroCreate(BaseModel):
    cliente:ClienteBase 
    Medidor: MedidorBase
    lectura: LecturaConsumoBase
    boleta: BoletaBase

class Registroout(BaseModel):
    #cliente
    id_medidor: int
    anio: int
    mes: int
    lectura_kwh: int
    observacion: Optional[str] = None
    
    # medidor
    codigo_medidor: str
    id_cliente: int
    direccion_suministro: Optional[str] = None
    estado: Optional[str] = "activo"

    #boleta
    id_cliente: int
    anio: int
    mes: int
    kwh_total: Decimal
    tarifa_base: Decimal
    cargos: Optional[Decimal] = Decimal("0.00")
    iva: Decimal
    total_pagar: Decimal
    estado: Optional[str] = "emitida"
