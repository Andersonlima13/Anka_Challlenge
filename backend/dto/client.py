from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class ClientCreateDTO(BaseModel):
    name: str
    email: EmailStr

class ClientUpdateDTO(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None

class ClientResponseDTO(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_active: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
