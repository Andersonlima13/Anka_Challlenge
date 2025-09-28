from pydantic import BaseModel
from datetime import date as dt_date
from enum import Enum
from typing import Optional 


class MovTypeEnum(str, Enum):
    deposit = "deposit"
    withdrawal = "withdrawal"


class MovimentacaoCreateDTO(BaseModel):
    client_id: int
    type: MovTypeEnum
    amount: float
    date: dt_date
    note: Optional[str] = None  


class MovimentacaoUpdateDTO(BaseModel):
    type: Optional[MovTypeEnum] = None
    amount: Optional[float] = None
    date: Optional[dt_date] = None  # pyright: ignore[reportInvalidTypeForm]
    note: Optional[str] = None  


class MovimentacaoResponseDTO(BaseModel):
    id: int
    client_id: int
    type: MovTypeEnum
    amount: float
    date: dt_date
    note: Optional[str] = None   

    class Config:
        from_attributes = True  
