from pydantic import BaseModel
from typing import Optional

# ================== Asset DTOs ==================

class AssetBaseDTO(BaseModel):
    ticker: str
    name: str
    exchange: str
    currency: str

class AssetCreateDTO(AssetBaseDTO):
    pass

class AssetUpdateDTO(BaseModel):
    ticker: Optional[str] = None
    name: Optional[str] = None
    exchange: Optional[str] = None
    currency: Optional[str] = None

class AssetResponseDTO(AssetBaseDTO):
    id: int

    model_config = {
        "from_attributes": True
    }

# ================== Allocation DTOs ==================

class AllocationCreateDTO(BaseModel):
    client_id: int
    asset_id: int
    percentage: float

class AllocationResponseDTO(BaseModel):
    id: int
    client_id: int
    asset_id: int
    percentage: float

    model_config = {
        "from_attributes": True
    }
