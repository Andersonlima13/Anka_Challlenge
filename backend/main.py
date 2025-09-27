import uvicorn
from fastapi import FastAPI, Depends
from config.database import SessionLocal, engine, Base
from controller import userController
from controller.authController import get_current_user

import model

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(userController.router)
app.include_router(userController.router, dependencies=[Depends(get_current_user)])

@app.get("/")
def root():
    return {"message": "API funcionando 🚀"}



if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)