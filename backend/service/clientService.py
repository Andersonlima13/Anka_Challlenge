from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from model.clients import Client
from dto.client import ClientCreateDTO, ClientUpdateDTO, ClientResponseDTO
from fastapi import HTTPException
from typing import List, Optional

class ClientService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[ClientResponseDTO]:
        clients = self.db.query(Client).all()
        return [ClientResponseDTO.from_orm(c) for c in clients]

    def get_by_id(self, client_id: int) -> Optional[ClientResponseDTO]:
        client = self.db.query(Client).filter(Client.id == client_id).first()
        return ClientResponseDTO.from_orm(client) if client else None

    def get_model_by_id(self, client_id: int) -> Optional[Client]:
        return self.db.query(Client).filter(Client.id == client_id).first()

    def create(self, client_data: ClientCreateDTO) -> ClientResponseDTO:
        new_client = Client(name=client_data.name, email=client_data.email)
        self.db.add(new_client)
        try:
            self.db.commit()
            self.db.refresh(new_client)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(status_code=400, detail="Email already registered")
        return ClientResponseDTO.from_orm(new_client)

    def update(self, client_id: int, client_data: ClientUpdateDTO) -> ClientResponseDTO:
        client = self.get_model_by_id(client_id)
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")

        if client_data.name is not None:
            client.name = client_data.name
        if client_data.email is not None:
            client.email = client_data.email
        if client_data.is_active is not None:
            client.is_active = client_data.is_active

        try:
            self.db.commit()
            self.db.refresh(client)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(status_code=400, detail="Email already registered")

        return ClientResponseDTO.from_orm(client)

    def delete(self, client_id: int) -> ClientResponseDTO:
        client = self.get_model_by_id(client_id)
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        self.db.delete(client)
        self.db.commit()
        return ClientResponseDTO.from_orm(client)
