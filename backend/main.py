import uvicorn
from fastapi import FastAPI
from config.database import SessionLocal, engine, Base
from controller import allocationController, assetController, clientController, userController, authController
import model

# Não precisa do create_all() se estiver usando Alembic
# Base.metadata.create_all(bind=engine)

app = FastAPI()

# Users já têm Depends(get_current_user) definidos dentro do controller
app.include_router(userController.router)
app.include_router(authController.router)
app.include_router(clientController.router)
app.include_router(assetController.router)
app.include_router(allocationController.router)



@app.get("/")
def root():
    return {"message": "API funcionando 🚀"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
