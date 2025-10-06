from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from config.database import SessionLocal
from model.users import Users
from service.userService import UserService
from typing import Optional

# =================== CONFIGURAÇÕES JWT ===================
SECRET_KEY = "super-secret-key"  # ⚠️ Use variável de ambiente em produção!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# =================== CONFIGURAÇÕES DE SENHA ===================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# =================== DEPENDÊNCIA DE BANCO ===================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =================== SERVIÇO DE AUTENTICAÇÃO ===================
class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_service = UserService(db)

    # Autentica usuário pelo email e senha
    def authenticate_user(self, email: str, password: str) -> Optional[Users]:
        user = self.user_service.get_by_email(email)
        if not user:
            print(f"⚠️ Usuário não encontrado: {email}")
            return None

        # Verifica a senha de forma segura
        try:
            if not pwd_context.verify(password, user.password):
                print(f"⚠️ Senha incorreta para o usuário: {email}")
                return None
        except Exception as e:
            print(f"❌ Erro ao verificar senha para {email}: {e}")
            return None

        return user

    # Cria o token JWT
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # Valida o token JWT
    def verify_token(self, token: str) -> Optional[dict]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            return None

# =================== DEPENDÊNCIA GLOBAL (ROTAS PROTEGIDAS) ===================
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Users:
    auth_service = AuthService(db)
    payload = auth_service.verify_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing 'sub' field",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(Users).filter(Users.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
