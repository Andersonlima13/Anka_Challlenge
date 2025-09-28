from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.database import SessionLocal
from service.allocationService import AllocationService
from dto.allocation import AllocationCreateDTO, AllocationResponseDTO
from service.authService import get_current_user

router = APIRouter(prefix="/allocations", tags=["Allocations"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================== Rotas de Allocations ==================

@router.post("/", response_model=AllocationResponseDTO, dependencies=[Depends(get_current_user)])
def create_allocation(allocation: AllocationCreateDTO, db: Session = Depends(get_db)):
    service = AllocationService(db)
    return service.create_allocation(allocation)

@router.get("/client/{client_id}", response_model=list[AllocationResponseDTO], dependencies=[Depends(get_current_user)])
def list_allocations_by_client(client_id: int, db: Session = Depends(get_db)):
    service = AllocationService(db)
    return service.get_allocations_by_client(client_id)

@router.get("/", response_model=list[AllocationResponseDTO], dependencies=[Depends(get_current_user)])
def list_all_allocations(db: Session = Depends(get_db)):
    service = AllocationService(db)
    return service.get_all_allocations()
