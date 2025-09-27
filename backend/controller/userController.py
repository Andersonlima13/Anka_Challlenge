from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import SessionLocal
from service.userService import UserService
from dto.users import UserCreateDTO, UserResponseDTO
from service.authService import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[UserResponseDTO])
def get_users(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    service = UserService(db)
    return service.get_all()

@router.get("/{user_id}", response_model=UserResponseDTO)
def get_user(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    service = UserService(db)
    user = service.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserResponseDTO)
def create_user(user: UserCreateDTO, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.create(user) 

@router.delete("/{user_id}", response_model=UserResponseDTO)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    service = UserService(db)
    deleted = service.delete(user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return deleted
