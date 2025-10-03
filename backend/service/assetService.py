from sqlalchemy.orm import Session
from model.assets import Asset
from model.allocations import Allocation
from dto.assets import AssetCreateDTO, AssetResponseDTO, AssetUpdateDTO, AllocationCreateDTO, AllocationResponseDTO
from fastapi import HTTPException
import yfinance as yf

class AssetService:
    def __init__(self, db: Session):
        self.db = db

    # ================== CRUD Asset ==================
    def create_asset(self, data: AssetCreateDTO) -> AssetResponseDTO:
        asset = Asset(**data.model_dump())
        self.db.add(asset)
        try:
            self.db.commit()
            self.db.refresh(asset)
        except Exception:
            self.db.rollback()
            raise HTTPException(status_code=400, detail="Asset already exists or invalid data")
        return AssetResponseDTO.from_orm(asset)

    def get_all_assets(self) -> list[AssetResponseDTO]:
        assets = self.db.query(Asset).all()
        return [AssetResponseDTO.from_orm(a) for a in assets]

    def get_asset_by_id(self, asset_id: int) -> AssetResponseDTO:
        asset = self.db.query(Asset).filter(Asset.id == asset_id).first()
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        return AssetResponseDTO.from_orm(asset)

    def update_asset(self, asset_id: int, data: AssetUpdateDTO) -> AssetResponseDTO:
        asset = self.db.query(Asset).filter(Asset.id == asset_id).first()
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        
        # Atualiza apenas os campos que vieram no DTO
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(asset, key, value)

        try:
            self.db.commit()
            self.db.refresh(asset)
        except Exception:
            self.db.rollback()
            raise HTTPException(status_code=400, detail="Failed to update asset")
        
        return AssetResponseDTO.from_orm(asset)

    def delete_asset(self, asset_id: int):
        asset = self.db.query(Asset).filter(Asset.id == asset_id).first()
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        self.db.delete(asset)
        self.db.commit()
        return {"detail": "Asset deleted successfully"}

    # ================== Busca Asset no Yahoo Finance ==================
    def fetch_asset_from_api(self, ticker: str) -> AssetResponseDTO:
        yf_asset = yf.Ticker(ticker)
        info = yf_asset.info

        if not info or "symbol" not in info:
            raise HTTPException(status_code=404, detail="Ticker not found")

        return AssetResponseDTO(
            id=0,  # id=0 indica que ainda não está salvo no banco
            ticker=info["symbol"],
            name=info.get("shortName", ticker),
            exchange=info.get("exchange", ""),
            currency=info.get("currency", "")
        )

    # ================== CRUD Allocation ==================
    def create_allocation(self, data: AllocationCreateDTO) -> AllocationResponseDTO:
        allocation = Allocation(**data.model_dump())
        self.db.add(allocation)
        self.db.commit()
        self.db.refresh(allocation)
        return AllocationResponseDTO.from_orm(allocation)

    def get_allocations_by_client(self, client_id: int) -> list[AllocationResponseDTO]:
        allocations = self.db.query(Allocation).filter(Allocation.client_id == client_id).all()
        return [AllocationResponseDTO.from_orm(a) for a in allocations]
