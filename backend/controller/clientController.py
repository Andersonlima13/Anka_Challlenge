from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import SessionLocal
from service.clientService import ClientService
from dto.client import ClientCreateDTO, ClientUpdateDTO, ClientResponseDTO
from service.authService import get_current_user
from model.users import Users

router = APIRouter(prefix="/clients", tags=["Clients"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[ClientResponseDTO])
def get_clients(db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    service = ClientService(db)
    return service.get_all()

@router.get("/{client_id}", response_model=ClientResponseDTO)
def get_client(client_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    service = ClientService(db)
    client = service.get_by_id(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.post("/create", response_model=ClientResponseDTO)
def create_client(client: ClientCreateDTO, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    service = ClientService(db)
    return service.create(client)

@router.put("/update/{client_id}", response_model=ClientResponseDTO)
def update_client(client_id: int, client: ClientUpdateDTO, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    service = ClientService(db)
    return service.update(client_id, client)

@router.delete("/delete/{client_id}", response_model=ClientResponseDTO)
def delete_client(client_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    service = ClientService(db)
    return service.delete(client_id)
