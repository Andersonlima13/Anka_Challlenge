from pydantic import BaseModel
from datetime import date

# Asset DTOs
class AssetCreateDTO(BaseModel):
    ticker: str
    name: str
    exchange: str
    currency: str

class AssetResponseDTO(BaseModel):
    id: int
    ticker: str
    name: str
    exchange: str
    currency: str

    model_config = {"from_attributes": True}

# Allocation DTOs
class AllocationCreateDTO(BaseModel):
    client_id: int
    asset_id: int
    quantity: float
    buy_price: float
    buy_date: date

class AllocationResponseDTO(BaseModel):
    id: int
    client_id: int
    asset_id: int
    quantity: float
    buy_price: float
    buy_date: date

    model_config = {"from_attributes": True}
