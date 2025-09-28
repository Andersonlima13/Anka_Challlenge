from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.database import SessionLocal
from service.movimentacaoService import MovimentacaoService
from dto.movimentacao import (
    MovimentacaoCreateDTO,
    MovimentacaoUpdateDTO,
    MovimentacaoResponseDTO,
)
from service.authService import get_current_user

router = APIRouter(prefix="/movimentacoes", tags=["Movimentações"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================== CRUD de Movimentações ==================

@router.post("/", response_model=MovimentacaoResponseDTO, dependencies=[Depends(get_current_user)])
def create_movimentacao(data: MovimentacaoCreateDTO, db: Session = Depends(get_db)):
    service = MovimentacaoService(db)
    return service.create_movimentacao(data)


@router.get("/", response_model=list[MovimentacaoResponseDTO], dependencies=[Depends(get_current_user)])
def list_all_movimentacoes(db: Session = Depends(get_db)):
    service = MovimentacaoService(db)
    return service.get_all_movimentacoes()


@router.get("/client/{client_id}", response_model=list[MovimentacaoResponseDTO], dependencies=[Depends(get_current_user)])
def list_movimentacoes_by_client(client_id: int, db: Session = Depends(get_db)):
    service = MovimentacaoService(db)
    return service.get_movimentacoes_by_client(client_id)

@router.get("/{mov_id}", response_model=MovimentacaoResponseDTO, dependencies=[Depends(get_current_user)])
def get_movimentacao(mov_id: int, db: Session = Depends(get_db)):
    service = MovimentacaoService(db)
    return service.get_movimentacao(mov_id)



@router.put("/{mov_id}", response_model=MovimentacaoResponseDTO, dependencies=[Depends(get_current_user)])
def update_movimentacao(mov_id: int, data: MovimentacaoUpdateDTO, db: Session = Depends(get_db)):
    service = MovimentacaoService(db)
    return service.update_movimentacao(mov_id, data)


@router.delete("/{mov_id}", dependencies=[Depends(get_current_user)])
def delete_movimentacao(mov_id: int, db: Session = Depends(get_db)):
    service = MovimentacaoService(db)
    return service.delete_movimentacao(mov_id)
