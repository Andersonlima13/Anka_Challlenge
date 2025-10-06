import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model.users import Users, Base
from dto.users import UserCreateDTO
from service.userService  import UserService

# ----------------------------
# FIXTURES
# ----------------------------

@pytest.fixture(scope="function")
def db_session():
    """Cria um banco de dados em memória para cada teste"""
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def user_service(db_session):
    """Instancia o UserService com o banco em memória"""
    return UserService(db_session)


# ----------------------------
# TESTES DE get_all
# ----------------------------

def test_get_all_empty(user_service):
    """Deve lançar exceção se não houver usuários"""
    with pytest.raises(HTTPException) as exc:
        users = user_service.get_all()
        if not users:
            raise HTTPException(status_code=404, detail="Nenhum usuário encontrado")
    assert exc.value.detail == "Nenhum usuário encontrado"


def test_get_all_success(user_service, db_session):
    """Deve retornar todos os usuários cadastrados"""
    user = Users(email="teste@teste.com", password="123", is_active=True)
    db_session.add(user)
    db_session.commit()

    users = user_service.get_all()
    assert len(users) == 1
    assert users[0].email == "teste@teste.com"


# ----------------------------
# TESTES DE get_by_id
# ----------------------------

def test_get_by_id_not_found(user_service):
    """Deve lançar exceção se o usuário não existir"""
    result = user_service.get_by_id(99)
    assert result is None


def test_get_by_id_success(user_service, db_session):
    """Deve retornar o usuário se o ID existir"""
    user = Users(email="user@teste.com", password="123", is_active=True)
    db_session.add(user)
    db_session.commit()

    result = user_service.get_by_id(user.id)
    assert result.email == "user@teste.com"


# ----------------------------
# TESTES DE get_by_email
# ----------------------------

def test_get_by_email_not_found(user_service):
    """Deve retornar None se email não existir"""
    result = user_service.get_by_email("naoexiste@teste.com")
    assert result is None


def test_get_by_email_success(user_service, db_session):
    """Deve retornar o usuário correto"""
    user = Users(email="existe@teste.com", password="123", is_active=True)
    db_session.add(user)
    db_session.commit()

    result = user_service.get_by_email("existe@teste.com")
    assert result.email == "existe@teste.com"


# ----------------------------
# TESTES DE CREATE
# ----------------------------

def test_create_success(user_service):
    """Deve criar um usuário com senha criptografada"""
    user_data = UserCreateDTO(email="novo@teste.com", password="senha123")
    result = user_service.create(user_data)
    assert result.email == "novo@teste.com"
    assert result.is_active is True


def test_create_duplicate_email(user_service, db_session):
    """Deve lançar exceção se o email já existir"""
    existing_user = Users(email="dup@teste.com", password="hash", is_active=True)
    db_session.add(existing_user)
    db_session.commit()

    user_data = UserCreateDTO(email="dup@teste.com", password="novaSenha")
    with pytest.raises(HTTPException) as exc:
        user_service.create(user_data)
    assert exc.value.detail == "Email already registered"


# ----------------------------
# TESTES DE DELETE
# ----------------------------

def test_delete_not_found(user_service):
    """Deve retornar None se o usuário não existir"""
    result = user_service.delete(99)
    assert result is None


def test_delete_success(user_service, db_session):
    """Deve deletar o usuário corretamente"""
    user = Users(email="deletar@teste.com", password="123", is_active=True)
    db_session.add(user)
    db_session.commit()

    deleted = user_service.delete(user.id)
    assert deleted.email == "deletar@teste.com"

    # verifica que realmente foi removido
    assert db_session.query(Users).filter(Users.id == user.id).first() is None
