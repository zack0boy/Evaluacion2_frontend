from typing import Union
from fastapi import FastAPI
from models import Registro
from .database import engine,base,get_db




base.metadata.create_all(bin=engine)

app = FastAPI(title="Registro de clientes",description="api para registro de personas")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers =["*"],
)

@app.post("/api/registro", response_model=schemas.Registroout)


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}