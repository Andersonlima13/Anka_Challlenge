from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Substitua pelos dados reais do seu banco
DATABASE_URL = "postgresql+psycopg2://postgres:12345@localhost:5432/anka"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass
