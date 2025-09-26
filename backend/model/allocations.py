from sqlalchemy import Column, Integer, Float, ForeignKey, Date
from config.database import Base


class Allocation(Base):
    __tablename__ = 'allocations'
    id = Column(Integer, primary_key=True)
    client_id = Column(Integer, ForeignKey('clients.id'), nullable=False)
    asset_id = Column(Integer, ForeignKey('assets.id'), nullable=False)
    quantity = Column(Float, nullable=False)
    buy_price = Column(Float, nullable=False)
    buy_date = Column(Date, nullable=False)
