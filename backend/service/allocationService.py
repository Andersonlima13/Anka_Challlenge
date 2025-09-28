from sqlalchemy.orm import Session
from model.allocations import Allocation
from dto.allocation import AllocationCreateDTO, AllocationResponseDTO
from fastapi import HTTPException

class AllocationService:
    def __init__(self, db: Session):
        self.db = db

    def create_allocation(self, data: AllocationCreateDTO) -> AllocationResponseDTO:
        allocation = Allocation(**data.model_dump())
        self.db.add(allocation)
        self.db.commit()
        self.db.refresh(allocation)
        return AllocationResponseDTO.from_orm(allocation)

    def get_allocations_by_client(self, client_id: int) -> list[AllocationResponseDTO]:
        allocations = self.db.query(Allocation).filter(Allocation.client_id == client_id).all()
        return [AllocationResponseDTO.from_orm(a) for a in allocations]

    def get_all_allocations(self) -> list[AllocationResponseDTO]:
        allocations = self.db.query(Allocation).all()
        return [AllocationResponseDTO.from_orm(a) for a in allocations]
