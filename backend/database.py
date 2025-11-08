from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Cargar variables del archivo .env
load_dotenv()

# Obtener la URL de conexión desde el archivo .env
# Ejemplo: DATABASE_URL=mysql+pymysql://root:1234@localhost:3306/mi_proyecto
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    echo=False,      # Cambia a True si quieres ver las consultas SQL en consola
    future=True
)

# Crear la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=True, bind=engine)
