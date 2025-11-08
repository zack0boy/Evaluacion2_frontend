from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Cargar variables del archivo .env
load_dotenv()

# Obtener la URL de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL")

# Configurar argumentos de conexión (necesario para SQLite)
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

# Crear el engine
engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    connect_args=connect_args
)

# Crear sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=True, bind=engine)

