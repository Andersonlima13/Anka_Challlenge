from sqlalchemy import Column, Integer, Float, ForeignKey, Enum, Date, Text
from config.database import Base
import enum


class MovType(enum.Enum):
    deposit = 'deposit'
    withdrawal = 'withdrawal'

class Movimentacao(Base):
    __tablename__ = 'movimentacoes'
    id = Column(Integer, primary_key=True)
    client_id = Column(Integer, ForeignKey('clients.id'), nullable=False)
    type = Column(Enum(MovType), nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    note = Column(Text)
