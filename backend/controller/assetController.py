from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from config.database import SessionLocal
from service.assetService import AssetService
from dto.assets import (
    AssetCreateDTO, AssetUpdateDTO, AssetResponseDTO,
    AllocationCreateDTO, AllocationResponseDTO
)
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
    """
    Retorna uma lista de ativos buscados diretamente da API do Yahoo Finance.
    Se nenhum ticker for informado, retorna ativos populares padrão.
    """
    service = AssetService(db)

    # Lista padrão de tickers para visualização
    default_tickers = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "META", "NFLX", "NVDA"]

    assets_list = []
    for ticker in default_tickers:
        try:
            asset_data = service.fetch_asset_from_api(ticker)
            assets_list.append(asset_data)
        except HTTPException:
            continue  # ignora tickers inválidos

    return assets_list

@router.get("/fetch/{ticker}", response_model=AssetResponseDTO, dependencies=[Depends(get_current_user)])
def fetch_asset(ticker: str, db: Session = Depends(get_db), save: bool = False):
    """
    Busca o ativo pelo ticker no Yahoo Finance.
    Se `save=True`, salva no banco; senão, apenas retorna os dados.
    """
    service = AssetService(db)
    asset_data = service.fetch_asset_from_api(ticker)
    
    if save:
        return service.create_asset(asset_data)
    return asset_data

@router.put("/{asset_id}", response_model=AssetResponseDTO, dependencies=[Depends(get_current_user)])
def update_asset(asset_id: int, asset: AssetUpdateDTO, db: Session = Depends(get_db)):
    service = AssetService(db)
    return service.update_asset(asset_id, asset)

@router.delete("/{asset_id}", dependencies=[Depends(get_current_user)])
def delete_asset(asset_id: int, db: Session = Depends(get_db)):
    service = AssetService(db)
    return service.delete_asset(asset_id)

# ================== Rotas de Allocations ==================

@router.post("/allocation", response_model=AllocationResponseDTO, dependencies=[Depends(get_current_user)])
def create_allocation(allocation: AllocationCreateDTO, db: Session = Depends(get_db)):
    service = AssetService(db)
    return service.create_allocation(allocation)

@router.get("/allocation/{client_id}", response_model=list[AllocationResponseDTO], dependencies=[Depends(get_current_user)])
def list_allocations(client_id: int, db: Session = Depends(get_db)):
    service = AssetService(db)
    return service.get_allocations_by_client(client_id)
