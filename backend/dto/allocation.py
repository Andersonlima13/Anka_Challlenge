from pydantic import BaseModel
from datetime import date

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

    class Config:
        from_attributes = True 