from sqlalchemy import Column, Integer, String
from app.database import Base  # Asegúrate de importar tu Base desde database.py

class Registro(Base):
    __tablename__ = "registro"  # <-- aquí era __tablename__, no __table__

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellidoPaterno = Column(String(100), nullable=False)
    apellidoMaterno = Column(String(100), nullable=False)
    telefono = Column(String(20))
    region = Column(String(100))
    comuna = Column(String(100))
