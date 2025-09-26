import uvicorn
from fastapi import FastAPI
from config.database import SessionLocal, engine, Base
import model

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/exemplo")
def example() -> str:
    return "hello world"



if __name__ == "__main__":
    uvicorn.run(app,port=8001)