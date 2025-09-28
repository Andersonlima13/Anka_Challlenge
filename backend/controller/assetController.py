from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import SessionLocal
from service.assetService import AssetService
from dto.assets import AssetCreateDTO, AssetResponseDTO, AllocationCreateDTO, AllocationResponseDTO
from service.authService import get_current_user

router = APIRouter(prefix="/assets", tags=["Assets"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================== Rotas de Assets ==================

@router.post("/create", response_model=AssetResponseDTO, dependencies=[Depends(get_current_user)])
def create_asset(asset: AssetCreateDTO, db: Session = Depends(get_db)):
    service = AssetService(db)
    return service.create_asset(asset)

@router.get("/", response_model=list[AssetResponseDTO], dependencies=[Depends(get_current_user)])
def list_assets(db: Session = Depends(get_db)):
    service = AssetService(db)
    return service.get_all_assets()

@router.get("/fetch/{ticker}", response_model=AssetResponseDTO, dependencies=[Depends(get_current_user)])
def fetch_asset(ticker: str, db: Session = Depends(get_db)):
    """
    Busca o ativo pelo ticker no Yahoo Finance e salva no banco.
    """
    service = AssetService(db)
    return service.fetch_and_create_asset(ticker)

# ================== Rotas de Allocations ==================

@router.post("/allocation", response_model=AllocationResponseDTO, dependencies=[Depends(get_current_user)])
def create_allocation(allocation: AllocationCreateDTO, db: Session = Depends(get_db)):
    service = AssetService(db)
    return service.create_allocation(allocation)

@router.get("/allocation/{client_id}", response_model=list[AllocationResponseDTO], dependencies=[Depends(get_current_user)])
def list_allocations(client_id: int, db: Session = Depends(get_db)):
    service = AssetService(db)
    return service.get_allocations_by_client(client_id)
