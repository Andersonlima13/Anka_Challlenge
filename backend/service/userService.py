from fastapi import HTTPException
from sqlalchemy.orm import Session
from model.users import Users
from dto.users import UserCreateDTO, UserResponseDTO
from typing import Optional
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[UserResponseDTO]:
        users = self.db.query(Users).all()
        return [UserResponseDTO.model_validate(u) for u in users]

    def get_by_id(self, user_id: int) -> Optional[UserResponseDTO]:
        user = self.db.query(Users).filter(Users.id == user_id).first()
        return UserResponseDTO.model_validate(user) if user else None

    def get_model_by_id(self, user_id: int) -> Optional[Users]:
        return self.db.query(Users).filter(Users.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[Users]:
        return self.db.query(Users).filter(Users.email == email).first()

    def authenticate(self, email: str, password: str) -> Optional[Users]:
        user = self.get_by_email(email)
        if not user:
            return None
        if not pwd_context.verify(password, user.password):
            return None
        return user

    def create(self, user_data: UserCreateDTO) -> UserResponseDTO:
        hashed_pw = pwd_context.hash(user_data.password)
        new_user = Users(email=user_data.email, password=hashed_pw, is_active=True)
        self.db.add(new_user)
        try:
            self.db.commit()
            self.db.refresh(new_user)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(status_code=400, detail="Email already registered")
        return UserResponseDTO.model_validate(new_user)

    def delete(self, user_id: int) -> Optional[UserResponseDTO]:
        user = self.db.query(Users).filter(Users.id == user_id).first()
        if not user:
            return None
        self.db.delete(user)
        self.db.commit()
        return UserResponseDTO.model_validate(user)
