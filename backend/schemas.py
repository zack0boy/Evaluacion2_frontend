from pydantic import BaseModel, EmailStr, constr, validator, Field
from typing import Optional, List, Annotated
from datetime import datetime

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

    @validator('rut')
    def validar_rut_chileno(cls, v):
        # Validación básica de RUT chileno
        if not v.replace('.', '').replace('-', '').isdigit():
            raise ValueError('RUT debe contener solo números, puntos y guión')
        return v

class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(BaseModel):
    nombre_razon: Optional[str] = None
    email_contacto: Optional[EmailStr] = None
    telefono: Optional[str] = None
    direccion_facturacion: Optional[str] = None
    estado: Optional[str] = None


class ClienteOut(ClienteBase):
    id_cliente: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

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

class MedidorUpdate(BaseModel):
    direccion_suministro: str
    estado: str
class MedidorOut(MedidorBase):
    id_medidor: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ==========================================================
# ESQUEMAS PARA BÚSQUEDA Y PAGINACIÓN
# ==========================================================

class ClienteSearch(BaseModel):
    rut: Optional[str] = None
    nombre_razon: Optional[str] = None
    page: int = Field(1, ge=1)
    limit: int = Field(10, ge=1, le=100)

class PaginatedResponse(BaseModel):
    page: int
    limit: int
    total: int
    items: List

# ==========================================================
# CORREO
# ==========================================================

class CorreoRequest(BaseModel):
    email_destino: EmailStr
    asunto: Optional[str] = "Boleta de Servicio"
    # Eliminar el campo de mensaje HTML
    # El frontend generará el HTML
    
class CorreoEnvioRequest(BaseModel):
    email_destino: EmailStr
    asunto: Optional[str] = None
    html_content: str  # HTML generado por el frontend