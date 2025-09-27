from pydantic import BaseModel, EmailStr


# DTO de entrada: apenas os dados necessários para criar o usuário
class UserCreateDTO(BaseModel):
    email: EmailStr
    password: str


# DTO de saída: todos os dados que devem ser expostos como resposta
class UserResponseDTO(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    
    model_config = {"from_attributes": True}  # Pydantic v2


