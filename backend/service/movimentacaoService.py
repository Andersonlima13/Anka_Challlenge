from sqlalchemy.orm import Session
from fastapi import HTTPException
from model.movimentacao import Movimentacao
from dto.movimentacao import (
    MovimentacaoCreateDTO,
    MovimentacaoUpdateDTO,
    MovimentacaoResponseDTO,
)


class MovimentacaoService:
    def __init__(self, db: Session):
        self.db = db

    def create_movimentacao(self, data: MovimentacaoCreateDTO) -> MovimentacaoResponseDTO:
        movimentacao = Movimentacao(**data.model_dump())
        self.db.add(movimentacao)
        self.db.commit()
        self.db.refresh(movimentacao)
        return MovimentacaoResponseDTO.from_orm(movimentacao)

    def get_movimentacao(self, mov_id: int) -> MovimentacaoResponseDTO:
        movimentacao = self.db.query(Movimentacao).filter(Movimentacao.id == mov_id).first()
        if not movimentacao:
            raise HTTPException(status_code=404, detail="Movimentação não encontrada")
        return MovimentacaoResponseDTO.from_orm(movimentacao)

    def get_all_movimentacoes(self) -> list[MovimentacaoResponseDTO]:
        movimentacoes = self.db.query(Movimentacao).all()
        return [MovimentacaoResponseDTO.from_orm(m) for m in movimentacoes]

    def get_movimentacoes_by_client(self, client_id: int) -> list[MovimentacaoResponseDTO]:
        movimentacoes = self.db.query(Movimentacao).filter(Movimentacao.client_id == client_id).all()
        return [MovimentacaoResponseDTO.from_orm(m) for m in movimentacoes]

    def update_movimentacao(self, mov_id: int, data: MovimentacaoUpdateDTO) -> MovimentacaoResponseDTO:
        movimentacao = self.db.query(Movimentacao).filter(Movimentacao.id == mov_id).first()
        if not movimentacao:
            raise HTTPException(status_code=404, detail="Movimentação não encontrada")

        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(movimentacao, field, value)

        self.db.commit()
        self.db.refresh(movimentacao)
        return MovimentacaoResponseDTO.from_orm(movimentacao)

    def delete_movimentacao(self, mov_id: int):
        movimentacao = self.db.query(Movimentacao).filter(Movimentacao.id == mov_id).first()
        if not movimentacao:
            raise HTTPException(status_code=404, detail="Movimentação não encontrada")

        self.db.delete(movimentacao)
        self.db.commit()
        return {"message": "Movimentação removida com sucesso"}
