import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.database import SessionLocal, engine, Base
from controller import (
    allocationController,
    assetController,
    clientController,
    movimentacaoController,
    userController,
    authController,
)
import model

# Não precisa do create_all() se estiver usando Alembic
# Base.metadata.create_all(bind=engine)

app = FastAPI()

# 🚀 Configuração de CORS para funcionar com o Next.js
origins = [
    "http://localhost:3000",  # Front local
    # "https://seu-dominio.com",  # Produção
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Permite cookies/httpOnly
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo routers
app.include_router(userController.router)
app.include_router(authController.router)
app.include_router(clientController.router)
app.include_router(assetController.router)
app.include_router(allocationController.router)
app.include_router(movimentacaoController.router)


@app.get("/")
def root():
    return {"message": "API funcionando 🚀"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
