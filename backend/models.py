from sqlalchemy import Column, Integer, String
from .database import Base, engine
from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    DECIMAL,
    ForeignKey,
    UniqueConstraint,
    CheckConstraint
)

from sqlalchemy import (
    Column, Integer, String, DECIMAL, ForeignKey,
    UniqueConstraint, CheckConstraint
)
from sqlalchemy.orm import relationship
from .database import Base


# =======================
# TABLA CLIENTES
# =======================
class Cliente(Base):
    __tablename__ = "clientes"

    id_cliente = Column(Integer, primary_key=True, index=True, autoincrement=True)
    rut = Column(String(12), unique=True, nullable=False)  # Formato chileno XX.XXX.XXX-X
    nombre_razon = Column(String(100), nullable=False)
    email_contacto = Column(String(100), nullable=False)
    telefono = Column(String(20))
    direccion_facturacion = Column(String(150))
    estado = Column(String(20), nullable=False, default="activo")
    created_at = Column(String(100))
    updated_at = Column(String(100))

    # Relaciones
    medidores = relationship("Medidor", back_populates="cliente", cascade="all, delete")
    boletas = relationship("Boleta", back_populates="cliente", cascade="all, delete")


# =======================
# TABLA MEDIDORES
# =======================
class Medidor(Base):
    __tablename__ = "medidores"

    id_medidor = Column(Integer, primary_key=True, index=True, autoincrement=True)
    codigo_medidor = Column(String(100), unique=True, nullable=False)
    id_cliente = Column(Integer, ForeignKey("clientes.id_cliente"), nullable=False)
    direccion_suministro = Column(String(150))
    estado = Column(String(20), nullable=False, default="activo")
    created_at = Column(String(100))
    updated_at = Column(String(100))

    # Relaciones
    cliente = relationship("Cliente", back_populates="medidores")
    lecturas = relationship("LecturaConsumo", back_populates="medidor", cascade="all, delete")


# =======================
# TABLA LECTURAS DE CONSUMO
# =======================
class LecturaConsumo(Base):
    __tablename__ = "lecturas_consumo"

    id_lectura = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_medidor = Column(Integer, ForeignKey("medidores.id_medidor"), nullable=False)
    anio = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=False)
    lectura_kwh = Column(Integer, nullable=False)
    observacion = Column(String(255))
    created_at = Column(String(100))

    __table_args__ = (
        UniqueConstraint("id_medidor", "anio", "mes", name="uq_medidor_anio_mes"),
        CheckConstraint("lectura_kwh >= 0", name="check_lectura_kwh_non_negative"),
    )

    medidor = relationship("Medidor", back_populates="lecturas")


# =======================
# TABLA BOLETAS
# =======================
class Boleta(Base):
    __tablename__ = "boletas"

    id_boleta = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_cliente = Column(Integer, ForeignKey("clientes.id_cliente"), nullable=False)
    anio = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=False)
    kwh_total = Column(DECIMAL(10, 2), nullable=False)
    tarifa_base = Column(DECIMAL(10, 2), nullable=False)
    cargos = Column(DECIMAL(10, 2))
    iva = Column(DECIMAL(10, 2), nullable=False)
    total_pagar = Column(DECIMAL(10, 2), nullable=False)
    estado = Column(String(20), nullable=False, default="emitida")
    created_at = Column(String(100))

    __table_args__ = (
        UniqueConstraint("id_cliente", "anio", "mes", name="uq_cliente_anio_mes"),
    )

    cliente = relationship("Cliente", back_populates="boletas")
