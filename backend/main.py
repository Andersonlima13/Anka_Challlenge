import uvicorn
from fastapi import FastAPI
from config.database import SessionLocal, engine, Base
from controller import userController, authController
import model

# Não precisa do create_all() se estiver usando Alembic
# Base.metadata.create_all(bind=engine)

app = FastAPI()

# Users já têm Depends(get_current_user) definidos dentro do controller
app.include_router(userController.router)

# Rotas de autenticação (login/logout)
app.include_router(authController.router)


@app.get("/")
def root():
    return {"message": "API funcionando 🚀"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
