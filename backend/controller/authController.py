from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from config.database import SessionLocal
from service.authService import AuthService, get_current_user
from dto.auth import TokenResponseDTO
from datetime import timedelta
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginDTO(BaseModel):
    email: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rota de login (DESPROTEGIDA)
@router.post("/login", response_model=TokenResponseDTO)
def login(data: LoginDTO, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user = auth_service.authenticate_user(data.email, data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials"
        )
    
    access_token = auth_service.create_access_token(
        data={"sub": str(user.id)}, expires_delta=timedelta(minutes=60)
    )

    # ✅ Não retorna client_id, apenas o token e tipo
    return {"access_token": access_token, "token_type": "bearer"}

# Rota de logout (PROTEGIDA)
@router.post("/logout")
def logout(current_user=Depends(get_current_user)):
    return {"message": f"Logout successful for user {current_user.email}"}
